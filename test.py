import requests
import pandas as pd
import json # Embora pandas lide com JSON, json.loads pode ser útil para depuração ou estruturas complexas
 
def extrair_e_salvar_deeplink_query(url_api: str, nome_arquivo_saida: str = 'deeplink_queries.xlsx'):
    """
    Faz uma requisição a uma API web, extrai o 'deeplinkQuery'
    e salva as informações em um arquivo Excel.
 
    Args:
        url_api (str): A URL da API web que retorna o JSON.
        nome_arquivo_saida (str): O nome do arquivo Excel de saída (ex: 'meus_dados.xlsx').
    """
    try:
        print(f"Fazendo requisição à API: {url_api}")
        response = requests.get(url_api)
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins (4xx ou 5xx)
 
        data = response.json() # Tenta converter a resposta para JSON
 
        # --- Lógica para extrair deeplinkQuery ---
        # Esta parte é crucial e depende da estrutura EXATA do seu JSON.
        # Vou dar alguns exemplos comuns. Escolha ou adapte o que se aplica.
 
        deeplink_queries = [] # Lista para armazenar todos os deeplinkQuery encontrados
 
        # Exemplo 1: O deeplinkQuery está diretamente em um objeto JSON (único resultado)
        # if 'deeplinkQuery' in data:
        #     deeplink_queries.append({'deeplinkQuery': data['deeplinkQuery']})
 
        # Exemplo 2: O JSON é uma lista de objetos, e cada objeto tem 'deeplinkQuery'
        if isinstance(data, list):
            print("A resposta da API é uma lista de objetos.")
            for item in data:
                if isinstance(item, dict) and 'deeplinkQuery' in item:
                    # Você pode querer extrair outras informações junto com o deeplinkQuery
                    # Por exemplo, se houver um 'id' ou 'nome' no mesmo objeto:
                    # id_item = item.get('id', 'N/A') # Usa .get para evitar erro se a chave não existir
                    # nome_item = item.get('nome', 'N/A')
                    # deeplink_queries.append({'ID': id_item, 'Nome': nome_item, 'DeeplinkQuery': item['deeplinkQuery']})
                    deeplink_queries.append({'DeeplinkQuery': item['deeplinkQuery']})
                elif isinstance(item, dict): # Caso não tenha deeplinkQuery, mas é um dict
                    print(f"Aviso: Objeto na lista não contém 'deeplinkQuery': {item.keys()}")
                else:
                    print(f"Aviso: Item inesperado na lista: {type(item)}")
 
        # Exemplo 3: O deeplinkQuery está aninhado, por exemplo, data -> results -> deeplinkQuery
        # if isinstance(data, dict) and 'results' in data and isinstance(data['results'], list):
        #     print("A resposta da API tem uma chave 'results' que é uma lista.")
        #     for item in data['results']:
        #         if isinstance(item, dict) and 'deeplinkQuery' in item:
        #             deeplink_queries.append({'DeeplinkQuery': item['deeplinkQuery']})
        #         elif isinstance(item, dict):
        #             print(f"Aviso: Objeto em 'results' não contém 'deeplinkQuery': {item.keys()}")
        #         else:
        #             print(f"Aviso: Item inesperado em 'results': {type(item)}")
 
        # Se nenhum dos exemplos acima se encaixar, você precisará inspecionar a estrutura do JSON.
        # print("Estrutura completa do JSON (primeiras 500 chars):", json.dumps(data, indent=2)[:500])
        # print("Você precisará adaptar a lógica de extração 'deeplink_query = ...' com base na estrutura real.")
 
 
        if not deeplink_queries:
            print("Nenhum 'deeplinkQuery' encontrado na resposta da API.")
            return
 
        # Cria um DataFrame do pandas com os dados extraídos
        df = pd.DataFrame(deeplink_queries)
 
        # Salva o DataFrame em um arquivo Excel
        # engine='xlsxwriter' é recomendado para evitar warnings ou erros em algumas versões
        df.to_excel(nome_arquivo_saida, index=False, engine='xlsxwriter')
        print(f"Dados salvos com sucesso em '{nome_arquivo_saida}'")
 
    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar ou receber resposta da API: {e}")
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON da resposta da API: {e}")
        print(f"Conteúdo da resposta (se disponível): {response.text[:500]}...")
    except KeyError as e:
        print(f"Erro: Chave '{e}' não encontrada na estrutura JSON esperada.")
        print("Verifique a estrutura do JSON e adapte a lógica de extração.")
        # Pode ser útil imprimir o JSON completo para depuração:
        # print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")
 
# --- COMO USAR ---
if __name__ == "__main__":
    # --- IMPORTANTE: Substitua esta URL pela URL REAL da sua API ---
    # Exemplo (NÃO é a sua API real, APENAS um placeholder):
    # url_da_sua_api = "https://api.example.com/produtos?categoria=eletronicos"
    # url_da_sua_api = "https://jsonplaceholder.typicode.com/posts" # Exemplo de API pública (não tem deeplinkQuery)
 
    # Simule a estrutura que você espera de uma API que retorna um array de objetos
    # com 'deeplinkQuery'. Isto é para teste local.
    # Em um cenário real, você apontaria para a sua API.
    # Se sua API exigir autenticação (chaves, tokens), você precisará adicioná-los
    # no `requests.get(url, headers={'Authorization': 'Bearer seu_token'})` ou `params`.
 
    # Para este exemplo, vou simular um servidor JSON localmente com Flask ou similar,
    # mas para rodar este script diretamente, você pode usar uma API pública que
    # se aproxime da sua estrutura, ou simplesmente definir `data` manualmente
    # para testar a parte de extração e salvamento em Excel.
 
    # Exemplo de URL de API hipotética que poderia retornar algo como o esperado
    # (esta URL não existe, é só para fins de demonstração da chamada):
    url_da_sua_api_real = "https://sua-api.com/v1/dados-de-produtos" # <--- SUBSTITUA PELA SUA URL REAL DA API
 
    # Se você não tiver uma URL de API pública ou um ambiente de teste,
    # pode criar um JSON de exemplo para testar a lógica de extração:
    # url_da_sua_api_real = "http://localhost:5000/mock_api_data" # Se você for rodar um mock server
 
    # Ou para testar a lógica de extração e salvamento sem uma API real:
    # Comente a linha acima e descomente as linhas abaixo para um teste offline:
    # import io
    # mock_json_string = """
    # [
    #     {"id": 1, "nome": "Produto A", "deeplinkQuery": "produto-a-detalhes"},
    #     {"id": 2, "nome": "Produto B", "deeplinkQuery": "produto-b-detalhes"},
    #     {"id": 3, "nome": "Produto C", "outra_chave": "valor"}
    # ]
    # """
    # with open('mock_data.json', 'w') as f:
    #     f.write(mock_json_string)
    #
    # # Neste caso, você precisaria mudar a função para ler de um arquivo ou string,
    # # ou criar um mini-servidor Flask para simular a API.
    # # Para o propósito de testar a extração e o xlsx, o mais fácil é simular a resposta:
    # class MockResponse:
    #     def __init__(self, json_data, status_code=200):
    #         self._json_data = json_data
    #         self.status_code = status_code
    #     def json(self):
    #         return self._json_data
    #     def raise_for_status(self):
    #         if self.status_code >= 400:
    #             raise requests.exceptions.HTTPError(f"HTTP Error: {self.status_code}")
    #     @property
    #     def text(self):
    #         return json.dumps(self._json_data)
    #
    # # mock_data para testar:
    # mock_api_data = [
    #     {"id": 101, "nome": "Item X", "deeplinkQuery": "app://detalhes/itemx?id=101"},
    #     {"id": 102, "nome": "Item Y", "deeplinkQuery": "app://detalhes/itemy?id=102&cat=eletronicos"},
    #     {"id": 103, "nome": "Item Z", "descricao": "Sem deeplink"} # Este não terá deeplinkQuery
    # ]
    #
    # # Substituir requests.get por uma simulação (apenas para teste sem API real)
    # # requests.get = lambda url: MockResponse(mock_api_data) # Isso sobrescreveria requests.get globalmente, cuidado!
    # # Para um teste mais limpo, você pode passar o JSON direto para a função se adaptar ela.
 
 
    # Chame a função principal com a URL da sua API
    # Extrai e salva para 'deeplink_queries.xlsx' no mesmo diretório do script
    extrair_e_salvar_deeplink_query(url_api=url_da_sua_api_real)
 
    # Se você quiser especificar um nome diferente para o arquivo:
    # extrair_e_salvar_deeplink_query(url_api=url_da_sua_api_real, nome_arquivo_saida='meus_deeplinks.xlsx')