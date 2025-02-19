const retardedKeywords = [
    'free palestine', 'trans', 'they/them', 'she/her', 
    'she/he', 'xe/xem', 'ze/zir', 'ey/em', '🇵🇸', '🏳️‍⚧️', 'any/all', '🏳️‍🌈', 'pronouns', 'транс', 'FreePalestine', 'they', 'LGBTQ', 'free Palestine',
    '𝐋𝐆𝐁𝐓', '𝗟𝗚𝗕𝗧', '𝐿𝐺𝐵𝑇', '𝑳𝑮𝑩𝑻', '𝗟𝗚𝗕𝗧', 
    'gender fluid', 'nonbinary', 'cis', 'cisgender', 'genderqueer', 'agender', 'bigender', 'two-spirit', 'binary', 'gender-neutral',
    'intersectionality', 'queer', 'fluidity', 'neopronouns', 'demiboy', 'demigirl', 'fae/faer', 'it/its', 'she/her', 'they/them',
    '🏳️‍⚧', '🌈', 'pride', 'pridemonth', 'transgender', 'transsexual', ' HRT ', '𝘁𝗵𝗲𝘆', 'Pansexual', 'Polyamorous',
    'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISFJ', 'ISFP', 'ESFJ', 'ESFP', 'ISTJ', 'ISTP', 'ESTJ', 'ESTP',
    'INTJ-A', 'INTJ-T', 'INTP-A', 'INTP-T', 'ENTJ-A', 'ENTJ-T', 'ENTP-A', 'ENTP-T',
    'INFJ-A', 'INFJ-T', 'INFP-A', 'INFP-T', 'ENFJ-A', 'ENFJ-T', 'ENFP-A', 'ENFP-T',
    'ISFJ-A', 'ISFJ-T', 'ISFP-A', 'ISFP-T', 'ESFJ-A', 'ESFJ-T', 'ESFP-A', 'ESFP-T', 
    'ISTJ-A', 'ISTJ-T', 'ISTP-A', 'ISTP-T', 'ESTJ-A', 'ESTJ-T', 'ESTP-A', 'ESTP-T'
];

const detectAndAddBadge = () => {
    const users = document.querySelectorAll('div[data-testid="UserName"]');
    const userDescriptions = document.querySelectorAll('div[data-testid="UserDescription"]');
    const images = document.querySelectorAll('img[alt="🇵🇸"], img[alt="🏳️‍🌈"], img[alt="🏳️‍⚧️"], img[alt="⚧️"]');
    const userLocations = document.querySelectorAll('span[data-testid="UserLocation"]');

    const keywordPattern = new RegExp(retardedKeywords.join('|'), 'i');

    users.forEach((profileName, index) => {
        const userDescription = userDescriptions[index];
        const userLocation = userLocations[index];
        const userImage = images[index];

        const isNameRelevant = profileName && keywordPattern.test(profileName.textContent.toLowerCase());
        const isDescriptionRelevant = userDescription && keywordPattern.test(userDescription.textContent.toLowerCase());
        const isImagesRelevant = userImage && keywordPattern.test(userImage.alt.toLowerCase());
        const isLocationRelevant = userLocation && keywordPattern.test(userLocation.textContent.toLowerCase());

        const closestDiv = profileName.closest('div');
        const existingBadge = closestDiv.querySelector('.custom-badge');

        if (!isNameRelevant && !isDescriptionRelevant && !isImagesRelevant && !isLocationRelevant && existingBadge) {
            existingBadge.remove();
        }

        if ((isNameRelevant || isDescriptionRelevant || isImagesRelevant || isLocationRelevant) && !existingBadge) {
            const detectedElement = profileName || userDescription || userImage || userLocation;
            const badge = document.createElement('button');
            badge.setAttribute('aria-label', 'Opinion: Retarded');
            badge.setAttribute('role', 'button');
            badge.classList.add('custom-badge');
            badge.type = 'button';

            const badgeText = document.createElement('span');
            badgeText.textContent = 'Opinion: Retarded';
            badge.appendChild(badgeText);

            detectedElement.closest('div').appendChild(badge);

            console.log(`Badge created for user: ${profileName.textContent}`);
        }
    });
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
                const existingBadges = document.querySelectorAll('.custom-badge');
                existingBadges.forEach(badge => badge.remove());
            }

            setTimeout(detectAndAddBadge);
        }
    };

    window.addEventListener('popstate', onURLChange);

    const observer = new MutationObserver(() => {
        detectAndAddBadge();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

monitorPageChanges();
detectAndAddBadge();
