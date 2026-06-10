// Utility script for Roll20 API.
// Select a single token, then run !getimg to print its thumb image URL.

const GetSelectedTokenImgsrc = (() => { // eslint-disable-line no-unused-vars
  const scriptName = 'GetSelectedTokenImgsrc';
  const version = '0.1.0';

  const getWho = (playerid) => (
    (getObj('player', playerid) || { get: () => 'GM' }).get('_displayname')
  );

  const toThumb = (imgsrc) => {
    if (!imgsrc) {
      return '';
    }

    const parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)(.*)$/);
    return parts ? `${parts[1]}thumb${parts[3]}` : imgsrc;
  };

  const showUsage = (who) => {
    sendChat(scriptName, `/w "${who}" Select exactly one token, then run !getimg.`);
  };

  const handleInput = (msg) => {
    if (msg.type !== 'api' || !/^!getimg\b/i.test(msg.content)) {
      return;
    }

    const who = getWho(msg.playerid);

    if (!msg.selected || msg.selected.length !== 1 || msg.selected[0]._type !== 'graphic') {
      showUsage(who);
      return;
    }

    const token = getObj('graphic', msg.selected[0]._id);
    if (!token) {
      sendChat(scriptName, `/w "${who}" Could not find the selected token.`);
      return;
    }

    const imgsrc = toThumb(token.get('imgsrc'));
    if (!imgsrc) {
      sendChat(scriptName, `/w "${who}" The selected token does not have a usable image source.`);
      return;
    }

    log(`${scriptName}: ${imgsrc}`);
    sendChat(scriptName, `/w "${who}" ${imgsrc}`);
  };

  const registerEventHandlers = () => {
    on('chat:message', handleInput);
  };

  on('ready', () => {
    log(`-=> ${scriptName} v${version} <=-`);
    registerEventHandlers();
  });

  return {};
})();
