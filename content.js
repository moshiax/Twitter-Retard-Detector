const retardedKeywords = [
'гендерно-нейтральний', 'гендерно-нейтральный', 'интерсекциональность', 'intersectionality', 'free palestine', 'gender-neutral', 'месяц гордости',
'freepalestine', 'вона/він/вони', 'месяцгордости', 'транссексуал', 'gender fluid', 'гендерфлюїд', 'неопронouns',
'трансгендер', 'genderqueer', 'neopronouns', 'transgender', 'transsexual', 'гендерфлюід', 'гендерфлюид',
'нейровідмін', 'genderfluid', 'займенники', 'экстраверт', 'екстраверт', 'гендерквір', 'флюїдність',
'пансексуал', 'two-spirit', 'pridemonth', 'небинарный', 'гендерквир', 'флюидность', 'вони/вона',
'they/them', 'цисгендер', 'вона/воно', 'вона/вона', 'вони/вони', 'extrovert', 'extravert',
'nonbinary', 'cisgender', 'pansexual', 'transphob', 'бисексуал', '𝐋𝐆𝐁𝐓', '𝗟𝗚𝗕𝗧',
'𝐿𝐺𝐵𝑇', '𝑳𝑮𝑩𝑻', 'вона/він', 'він/вони', 'pronouns', 'бінарний', 'демігёрл',
'фае/фаер', 'поліамор', 'транс', 'bigender', 'fluidity', 'demigirl', 'fae/faer',
'polyamor', 'homophob', 'лесбійка', 'бигендер', 'два духа', 'демигёрл', 'гордость',
'полиамор', 'трансфоб', 'асексуал', 'меломан', 'мізогін', 'she/her', 'any/all',
'агендер', 'гомофоб', 'ейблізм', 'agender', 'demiboy', 'fatphob', 'ableism',
'небинар', 'демибой', 'оно/оно', 'она/она', 'они/они', 'эйблизм', '🏳️‍🌈',
'🏳️‍⚧️', 'she/he', 'xe/xem', 'ze/zir', 'intj-a', 'амбиверт', 'intj-t',
'intp-a', 'intp-t', 'entj-a', 'entj-t', 'entp-a', 'entp-t', 'infj-a',
'infj-t', 'infp-a', 'infp-t', 'enfj-a', 'enfj-t', 'enfp-a', 'enfp-t',
'isfj-a', 'isfj-t', 'isfp-a', 'isfp-t', 'esfj-a', 'esfj-t', 'esfp-a',
'esfp-t', 'istj-a', 'istj-t', 'istp-a', 'istp-t', 'estj-a', 'estj-t',
'estp-a', 'estp-t', 'фетфоб', 'расис', 'расист', 'сексиз', 'сексис',
'binary', 'it/its', 'фэтфоб', 'trans', 'ey/em', 'lgbtq', 'queer',
'pride', 'racis', 'sexis', '🇵🇸', 'интроверт', 'слюр', 'intj',
'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp',
'slay', 'they', 'isfj', 'isfp', 'esfj', 'esfp', 'istj',
'istp', 'estj', 'estp', 'ixtj', 'лгбт', 'квір', 'lgbt',
'квир', 'hrt', 'cis', 'цис', 'інтергендер', '🏳‍⚧', '🏳‍🌈',
'він/вони/вона', 'він/вона', 'вона/вони', 'він/вона/вони', 'трансдевушка', 'феміністка', 'вона/її',
'радфем', 'русофобка', 'ейджис', 'ейбліс', 'вони/їх',
];
const retardedKeywordsArray = [];

retardedKeywordsArray.push(...retardedKeywords);
retardedKeywordsArray.forEach(word => {
  if (word.includes(' ')) {
    retardedKeywordsArray.push(word.replace(/\s+/g, ''));
  }

  const wordWithI = word.replace(/и/g, 'і');
  if (word !== wordWithI) {
    retardedKeywordsArray.push(wordWithI);
  }
});

console.log(JSON.stringify(retardedKeywordsArray));

const detectAndAddHighlight = () => {
    const users = document.querySelectorAll('div[data-testid="UserName"]');
    const userDescriptions = document.querySelectorAll('div[data-testid="UserDescription"]');
    const images = document.querySelectorAll('img[alt="🇵🇸"], img[alt="🏳️‍🌈"], img[alt="🏳️‍⚧️"], img[alt="⚧️"]');
    const userLocations = document.querySelectorAll('span[data-testid="UserLocation"]');

    const matchedWords = new Set();
    const sortedKeywords = retardedKeywordsArray.sort((a, b) => b.length - a.length);

    users.forEach((profileName, index) => {
        const userDescription = userDescriptions[index];
        const userLocation = userLocations[index];
        const userImage = images[index];

        const allElements = [profileName, userDescription, userImage, userLocation];

        allElements.forEach(detectedElement => {
            if (detectedElement) {
                let elementText = detectedElement.textContent || detectedElement.alt || '';

                sortedKeywords.forEach(word => {
                    const isEmoji = /\p{Emoji}/u.test(word);
                    const regex = new RegExp(`(?<=^|\\s|[^\\wа-яА-Я])(${word}[\\p{L}]{0,3})(?=\\s|[^\\wа-яА-Я]|$)`, 'giu');
                    
                    if (isEmoji) {
                        elementText = elementText.replace(new RegExp(`(${word})`, 'g'), '<span class="highlight">$1</span>');
                    } else {
                        if (regex.test(elementText)) {
                            if (!matchedWords.has(word)) {
                                matchedWords.add(word);
                                elementText = elementText.replace(regex, '<span class="highlight">$1</span>');
                            }
                        }
                    }
                });

                if (!detectedElement.querySelector('span.highlight') && elementText !== detectedElement.innerHTML) {
                    detectedElement.innerHTML = elementText;
                }
            }
        });
    });
};

const monitorPageChanges = () => {
    const observer = new MutationObserver(() => {
        detectAndAddHighlight(); 
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

window.addEventListener('load', () => {
    setTimeout(() => {
        monitorPageChanges();
        detectAndAddHighlight();
    }, 1); 
});
