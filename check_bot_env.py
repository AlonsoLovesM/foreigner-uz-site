import importlib.util
import os
mods = ['openai','telegram','dotenv']
for m in mods:
    print(m, 'OK' if importlib.util.find_spec(m) else 'MISSING')
print('BOT_TOKEN', bool(os.getenv('BOT_TOKEN')))
print('OWNER_ID', bool(os.getenv('OWNER_ID')))
print('OPENAI_API_KEY', bool(os.getenv('OPENAI_API_KEY')))
