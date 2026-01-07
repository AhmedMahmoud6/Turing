import sys
from firebase_admin import credentials, firestore, initialize_app
import firebase_admin

SA_PATH = r'E:\vs\tedx\Turing-master\sa.json'
COL = 'workshop_registrations'

try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(SA_PATH)
        initialize_app(cred)
except Exception as e:
    print('Firebase init failed:', e)
    sys.exit(1)

try:
    db = firestore.client()
except Exception as e:
    print('Failed to create Firestore client:', e)
    sys.exit(1)

print('Listing recent documents in', COL)
try:
    docs = db.collection(COL).order_by('created_at', direction=firestore.Query.DESCENDING).limit(20).stream()
    for d in docs:
        dd = d.to_dict() or {}
        print('---')
        print('id:', d.id)
        print('created_at:', dd.get('created_at'))
        print('email_sent:', dd.get('email_sent'))
        print('email_error:', dd.get('email_error'))
        print('data_preview:', {k:v for k,v in dd.items() if k not in ('created_at','email_error')})
except Exception as e:
    print('Error listing docs:', e)
