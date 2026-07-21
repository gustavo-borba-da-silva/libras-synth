import bpy
import os
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import math

fbxFile = Path(__file__).parent.parent /"raw_dictionary"/"clara_RU_salada_067_Motion.Fbx"
file_path = filedialog.askopenfilename(
    title="Select a file",
    filetypes=(("fbx files", "*.fbx"), ("Fbx Files", "*.Fbx"))
)
fbxFileName = os.path.basename(file_path)

bpy.ops.import_scene.fbx(filepath=str(file_path))
armature = bpy.data.objects["Armature"]
bones = armature.pose.bones

armature.rotation_mode = "QUATERNION"

scene = bpy.context.scene

##### frame cropping #######




# Structure:
#     word/sentence
#      -> gesture_type                
#          -> frame_interval




# ELAN DATA GOES HERE



def parseXML(xmlFile):
    tree = ET.parse(xmlFile)
    root = tree.getroot()

    header = root.find("HEADER")
    time_unit = header.get("TIME_UNITS")
    time_multiplier = 1
    frame_rate = 60

    match time_unit:
        case "milliseconds":
            time_multiplier = 10**(-3)
        case "seconds":
            time_multiplier = 1
        case "minutes":
            time_multiplier = 60    
    
    framestamps = {}
    
    for item in root.findall("TIME_SLOT"):
        # Ex: framestamps[ts3] = 310 * 10**-3 * 60 = 18,6 -> round(18,6) = 19 (19th frame)
        framestamps[item.get("TIME_SLOT_ID")] = round(item.get("TIME_VALUE") * time_multiplier * frame_rate)

    # A partir daqui eu já tenho o valor em frames que cada timestamp representa
    gesture_data = {}

    gloss_data = {}

    for item in root.findall("TIER"):

        annotations = item.findall("ALIGNABLE_ANNOTATION") 
        if len(annotations) > 0:
            for ann in annotations:
                frame_interval = []
                frame_interval.append(framestamps[ann.get("TIME_SLOT_REF1")])
                frame_interval.append(framestamps[ann.get("TIME_SLOT_REF2")])

                gesture_data[item.get("TIER_ID")] = frame_interval
                
                gloss = ann.find("ANNOTATION_VALUE")
                gloss_data[gloss.text] = gesture_data

    # A partir daqui temos por exemplo gloss_data["SALADA"] = {"Sinal Lexical MD": [100, 310], "Sinal Lexical ME": [100, 310]}

    return gloss_data


parent_folder_path = Path(__file__).parent
directory = os.fsencode(parent_folder_path)
gloss_data = {}

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".eaf"):
        gloss_data = parseXML(filename)
        
# A partir daqui, tenho gloss_data no global pra usar

for gloss, gesture_data in gloss_data.items():
    for gesture_type, frame_interval in gesture_data.items():
        frame_interval = 1        

"""
    For each word (gloss), I have all the gesture types in a specific frame region
    
    Dúvidas que surgiram:
        - Is there ever going to be a gloss that has a gesture that include different frame intervals?
        - How am I going to translate the gesture data into the actual movement quaternions?

"""

# total_frames = frame_end - frame_start + 1

##### getting quaternion data from bones in animation (order x, y, z, w) #######
quaternion_data = {
    "FrameCount": total_frames,
}

for frame in range(frame_start, frame_end + 1):
    scene.frame_set(frame)
    # print(f"Frame {frame}:")

    frame_data = {
      "FrameId": frame + 1
    }

    for b in bones:
        
        q = b.rotation_quaternion.copy()
        # print(f"    Bone {b.basename}: \n {q}")

        frame_data[b.basename] = [q.x, q.y, q.z, q.w]

    quaternion_data.setdefault("FrameData", []).append(frame_data)

# print(quaternion_data)
# for frame_data in quaternion_data["FrameData"]:
#     for key, value in frame_data.items():
#         print(f"{key}: {value}")

##### putting it into json files ######
json_filename = '/'.join([os.path.dirname(os.path.dirname(fbxFile)) ,"json_dictionary", f"{name}_1.json"])
print(json_filename)

counter = 1
while os.path.exists(json_filename):
    json_filename = json_filename.replace(f"{counter}.json", f"{counter + 1}.json")
    counter += 1

with open(json_filename, 'w') as f:
    json.dump(quaternion_data, f, indent=4)
