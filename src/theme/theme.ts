export const colors = {
  white: '#F2F2F2',
  gray: '#474747',
  black: '#121317',
  light: 'rgba(255, 255, 255, 0.5)',
  lightRed: '#ee6b6e',
  darkBlue: '#5368A6',
  lightBlue: '#8A97BF',
  lightGreen: '#82D9A8',
  darkGreen: '#95BFA4',
  // new theme
  primary: '#0D4C73',

  success: '#dcf8c5',
  danger: '#ee6b6e',
  info: '#474747',

  background: '#070C20',
  text: '#F2F2F2',
  border: '#00020D',

  overlay: 'rgba(7, 12, 32, 0.5)',
};

export const fonts = {
  mono: 'CutiveMono-Regular',
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  bold: 'Rubik-Bold',
};

/*

Ao criar um sistema de Dark e Light mode para o seu aplicativo, é importante pensar em uma abordagem consistente para nomear e organizar as cores. Existem várias maneiras de fazer isso, mas uma abordagem comum é usar um esquema de nomenclatura semântica, onde os nomes das cores refletem sua finalidade e uso.

Aqui está um exemplo de esquema de nomenclatura que você pode adotar para o seu aplicativo:

1. Cores primárias:
   - primary: A cor principal do seu aplicativo, geralmente usada para elementos-chave, como botões principais e links.
   - secondary: Uma cor secundária que complementa a cor primária, usada para elementos secundários e de destaque.

2. Cores de estado:
   - success: Uma cor usada para indicar sucesso ou êxito, como uma operação bem-sucedida ou um resultado positivo.
   - danger: Uma cor usada para indicar perigo, erro ou alerta importante.
   - warning: Uma cor usada para indicar avisos ou situações de atenção.

3. Cores básicas:
   - background: A cor de fundo geral do seu aplicativo.
   - text: A cor do texto principal, geralmente contrastando com o plano de fundo.
   - border: A cor das bordas e divisores entre elementos.

4. Outras cores:
   - accent: Uma cor de destaque usada para elementos especiais, como destaques ou chamadas para ação.
   - overlay: Uma cor semi-transparente usada para sobrepor ou destacar elementos.

Lembre-se de que esses são apenas exemplos e você pode adaptar o esquema de nomenclatura de acordo com as necessidades do seu aplicativo. É importante manter a consistência ao nomear as cores para facilitar a manutenção e o entendimento do código.

Além disso, ao implementar o Dark e Light mode, você precisará definir uma paleta de cores para cada modo e alternar entre elas com base nas preferências do usuário. Geralmente, isso é feito alterando as cores primárias, secundárias e básicas para versões adequadas para cada modo.

Lembre-se também de considerar a acessibilidade ao escolher as cores para cada modo, garantindo um contraste adequado entre o texto e o plano de fundo para uma boa legibilidade. Existem ferramentas online que podem ajudar a verificar a acessibilidade das cores, como o WCAG Contrast Checker.

Espero que isso ajude você a criar um sistema de Dark e Light mode para o seu aplicativo!

*/
