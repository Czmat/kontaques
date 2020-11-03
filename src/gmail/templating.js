let templatedSubject;
let templatedBody;
let trim = '';
let newWord;

export default function templateEmail(contact, body) {
  var splitString = body.split(' ');

  splitString.forEach((s) => {
    if (s[0] == '%') {
      const index = splitString.indexOf(s);
      if (
        s[s.length - 1] == ',' ||
        s[s.length - 1] == '!' ||
        s[s.length - 1] == '?' ||
        s[s.length - 1] == '.' ||
        s[s.length - 1] == '"'
      ) {
        trim = s[s.length - 1];
        // s = s.replace(/[!?,."]/g, '');
        s = s.slice(0, s.length - 1);
        console.log('s', s);
      }
      if (s[s.length - 1] == '%') {
        let attribute = s.replace(/%/g, '');
        let nested = attribute.split('.');

        console.log('nested', nested);
        if (index > -1) {
          // if this is a nested attribute, your new word has two indices
          if (nested[1] && contact[nested[0]][nested[1]]) {
            newWord = contact[nested[0]][nested[1]];
            console.log('newword', newWord);

            splitString.splice(index, 1, newWord);
          } else if (contact[attribute]) {
            console.log('contactattribute', contact[attribute]);
            newWord = contact[attribute].concat(trim);
            splitString.splice(index, 1, newWord);
          } else {
            splitString.splice(index, 1, '!ERR: Missing ' + attribute + '!');
          }
        }
      }
    }
  });
  console.log('splitString', splitString);
  if (splitString[0] == '!Subject!') {
    splitString.shift();
    templatedSubject = splitString.join(' ');
  } else {
    templatedBody = splitString.join(' ');
  }
}
export { templatedBody, templatedSubject };
