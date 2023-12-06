import random 
import iso639

random.seed(10)

def random_color_generator():
    color = "#"
    hexadecimal_alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    for c in range(0,6):
        random_ix = random.randint(0,15)
        color += hexadecimal_alphabet[random_ix]
    return color



for lang in iso639.ALL_LANGUAGES:
    if lang.status == 'R':
        continue
    print(f'["{lang.name}", ', end="")
    print("{", end="")
    color = random_color_generator()
    print(f"abbreviation: '{lang.part3.upper()}', color: '{color}'", end="") 
    print("}],")