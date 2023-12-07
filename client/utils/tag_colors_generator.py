import random 

random.seed(10)

def random_color_generator():
    color = "#"
    hexadecimal_alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    for c in range(0,6):
        random_ix = random.randint(0,15)
        color += hexadecimal_alphabet[random_ix]
    return color



for lang in [
    "English",
    "Chinese",
    "Spanish",
    "Hindi",
    "Arabic",
    "Portuguese",
    "Bengali",
    "Russian",
    "Japanese",
    "Punjabi",
    "French",
    "German",
    "Italian",
    "Dutch",
    "Swedish",
    "Polish",
    "Greek",
    "Romanian",
    "Spanish",
    "Portuguese",
    "Chinese",
    "Hindi",
    "Bengali",
    "Japanese",
    "Punjabi",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Turkish",
    "Swahili",
    "Hausa",
    "Yoruba",
    "Amharic",
    "Zulu",
    "Igbo",
    "Shona",
    "Somali",
    "Fulfulde",
    "Tigrinya",
    "Arabic",
    "Persian (Farsi)",
    "Turkish",
    "Hebrew",
    "Kurdish",
    "Quechua",
    "Maori",
    "Ainu",
    "Navajo",
  ]:
    print(f"['{lang}', ", end="")
    print("{", end="")
    str = lang[:3]
    str = str.upper()
    color = random_color_generator()
    print(f"abbreviation: '{str}', color: '{color}'", end="") 
    print("}],")