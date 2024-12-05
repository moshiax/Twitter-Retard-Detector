const retardedKeywords = [
    'free palestine', 'trans', 'they/them', 'she/her', 
    'she/he', 'xe/xem', 'ze/zir', 'ey/em', '🇵🇸', '🏳️‍⚧️', 'any/all', '🏳️‍🌈', 'pronouns', 'транс', 'FreePalestine', 'they', 'LGBTQ', 'free Palestine',
    '𝐋𝐆𝐁𝐓', '𝗟𝗚𝗕𝗧', '𝐿𝐺𝐵𝑇', '𝑳𝑮𝑩𝑻', '𝗟𝗚𝗕𝗧', 
    'gender fluid', 'nonbinary', 'cis', 'cisgender', 'genderqueer', 'agender', 'bigender', 'two-spirit', 'binary', 'gender-neutral',
    'intersectionality', 'queer', 'fluidity', 'neopronouns', 'demiboy', 'demigirl', 'fae/faer', 'it/its', 'she/her', 'they/them',
    '🏳️‍⚧', '🌈', 'pride', 'pridemonth', 'transgender', 'transsexual',
    'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISFJ', 'ISFP', 'ESFJ', 'ESFP', 'ISTJ', 'ISTP', 'ESTJ', 'ESTP',
    'INTJ-A', 'INTJ-T', 'INTP-A', 'INTP-T', 'ENTJ-A', 'ENTJ-T', 'ENTP-A', 'ENTP-T',
    'INFJ-A', 'INFJ-T', 'INFP-A', 'INFP-T', 'ENFJ-A', 'ENFJ-T', 'ENFP-A', 'ENFP-T',
    'ISFJ-A', 'ISFJ-T', 'ISFP-A', 'ISFP-T', 'ESFJ-A', 'ESFJ-T', 'ESFP-A', 'ESFP-T',
    'ISTJ-A', 'ISTJ-T', 'ISTP-A', 'ISTP-T', 'ESTJ-A', 'ESTJ-T', 'ESTP-A', 'ESTP-T'
];

const detectAndAddBadge = () => {
    const userDescription = document.querySelector('div[data-testid="UserDescription"]');
    const profileName = document.querySelector('div[data-testid="UserName"]');
    const images = document.querySelectorAll('img[alt="🇵🇸"], img[alt="🏳️‍🌈"], img[alt="🏳️‍⚧️"], img[alt="⚧️"]');
    const userLocation = document.querySelector('span[data-testid="UserLocation"]');

    const keywordPattern = new RegExp(retardedKeywords.join('|'), 'i');

    const isNameRelevant = profileName && keywordPattern.test(profileName.textContent.toLowerCase());
    const isDescriptionRelevant = userDescription && keywordPattern.test(userDescription.textContent.toLowerCase());
    const isImagesRelevant = images.length > 0;
    const isLocationRelevant = userLocation && keywordPattern.test(userLocation.textContent.toLowerCase());

    const existingBadge = document.querySelector('.custom-badge');

    if ((isNameRelevant || isDescriptionRelevant || isImagesRelevant || isLocationRelevant) && !existingBadge) {
        const detectedElement = profileName || userDescription || images[0] || userLocation;
        const badge = document.createElement('button');
        badge.setAttribute('aria-label', 'Opinion: Retarded');
        badge.setAttribute('role', 'button');
        badge.classList.add('custom-badge');
        badge.type = 'button';

        const badgeText = document.createElement('span');
        badgeText.textContent = 'Opinion: Retarded';
        badge.appendChild(badgeText);

        detectedElement.closest('div').appendChild(badge);

        if (isNameRelevant) {
            console.log(`Badge created due to relevant name text: ${profileName.textContent}`);
        }
        if (isDescriptionRelevant) {
            console.log(`Badge created due to relevant description text: ${userDescription.textContent}`);
        }
        if (isImagesRelevant) {
            console.log(`Badge created due to relevant image with alt: ${images[0].alt}`);
        }
        if (isLocationRelevant) {
            console.log(`Badge created due to relevant location text: ${userLocation.textContent}`);
        }
    }
};


const monitorPageChanges = () => {
    let currentURL = window.location.href;

    const getProfileURL = (url) => {
        const path = url.split('?')[0]; 
        const fragments = path.split('/'); 
        return fragments.slice(0, 4).join('/');
    };

    const isSignificantChange = (newURL) => {
        return getProfileURL(currentURL) !== getProfileURL(newURL);
    };

    const onURLChange = () => {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;

            if (isSignificantChange(window.location.href)) {
                const existingBadge = document.querySelector('.custom-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
            }

            setTimeout(waitForElementsAndRun);
        }
    };

    window.addEventListener('popstate', onURLChange);

    const observer = new MutationObserver(() => {
        if (window.location.href !== currentURL) {
            onURLChange();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

const waitForElementsAndRun = () => {
    const profileName = document.querySelector('div[data-testid="UserName"]');
    const userDescription = document.querySelector('div[data-testid="UserDescription"]');

    if ((profileName && userDescription) || !profileName || !userDescription) {
        const existingBadge = document.querySelector('.custom-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
		detectAndAddBadge();
        setTimeout(detectAndAddBadge, 500);
		setTimeout(detectAndAddBadge, 1300);
    } else {
        setTimeout(waitForElementsAndRun, 500);
    }
};

monitorPageChanges();
detectAndAddBadge();
setTimeout(detectAndAddBadge, 500);
setTimeout(detectAndAddBadge, 1300);