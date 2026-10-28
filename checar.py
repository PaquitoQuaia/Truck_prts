import mysql.connector
from app import app

cnx = mysql.connector.connect(
    host='127.0.0.1',
    user='root',
    password='senai105',
    database='DB_truck_prts'
)
cur = cnx.cursor(dictionary=True)
cur.execute('SELECT id_produto, estoque FROM PRODUTO ORDER BY id_produto LIMIT 1')
produto = cur.fetchone()
print('ANTES', produto['estoque'])

with app.test_client() as client:
    cur2 = cnx.cursor(dictionary=True)
    cur2.execute('SELECT id_usuario FROM USUARIO ORDER BY id_usuario LIMIT 1')
    usuario = cur2.fetchone()
    with client.session_transaction() as sess:
        sess['usuario_id'] = usuario['id_usuario']
        sess['usuario_nome'] = 'Teste'
    resp = client.post(
        f"/add_to_cart/{produto['id_produto']}",
        json={'quantidade': 1},
        headers={'X-Requested-With': 'XMLHttpRequest'}
    )
    print('STATUS', resp.status_code)
    print('JSON', resp.get_json())

cur.execute('SELECT id_produto, estoque FROM PRODUTO WHERE id_produto = %s', (produto['id_produto'],))
print('DEPOIS', cur.fetchone()['estoque'])
cnx.close()
