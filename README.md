# Arquivos de Categorias

Estes arquivos contêm a lista padrão de `Categoria / Subgrupo` usada pela aplicação.

- `categories.json`: Array de objetos com campos `tipo`, `categoria` e `subgrupo`.
- `categories.csv`: Mesma informação em CSV com cabeçalho `tipo,categoria,subgrupo`.

Uso rápido (JavaScript):

```js
// carregar JSON
fetch('/categories.json').then(r => r.json()).then(data => console.log(data));

// carregar CSV (exemplo simples)
fetch('/categories.csv').then(r => r.text()).then(txt => console.log(txt));
```

Se quiser outro formato (XML, YAML) ou integração direta no app, me avise.
