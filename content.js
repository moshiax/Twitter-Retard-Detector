const detectAndAddBadge = () => {
    const userDescription = document.querySelector('div[data-testid="UserDescription"]');
    const profileName = document.querySelector('div[data-testid="UserName"]');
    const images = document.querySelectorAll('img[alt="🇵🇸"], img[alt="🏳️‍🌈"], img[alt="🏳️‍⚧️"], img[alt="⚧️"]');

    const retardedKeywords = [
        'free palestine', 'trans', 'they/them', 'she/her', 
        'she/he', 'xe/xem', 'ze/zir', 'ey/em', '🇵🇸', '🏳️‍⚧️', 'any/all', '🏳️‍🌈', 'pronouns',  '#FreePalestine', 'LGBTQ', 'free Palestine'
    ];

    const keywordPattern = new RegExp(retardedKeywords.join('|'), 'i');

    const isNameRelevant = profileName && keywordPattern.test(profileName.textContent.toLowerCase());
    const isDescriptionRelevant = userDescription && keywordPattern.test(userDescription.textContent.toLowerCase());
    const isImagesRelevant = images.length > 0;

    const existingBadge = document.querySelector('.custom-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    if ((isNameRelevant || isDescriptionRelevant || isImagesRelevant) && !existingBadge) {
        const detectedElement = profileName || userDescription || images[0];
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
            const keyword = retardedKeywords.find(keyword => new RegExp(keyword, 'i').test(profileName.textContent.toLowerCase()));
            console.log(`Found "${keyword}" in profile name.`);
        }
        if (isDescriptionRelevant) {
            const keyword = retardedKeywords.find(keyword => new RegExp(keyword, 'i').test(userDescription.textContent.toLowerCase()));
            console.log(`Found "${keyword}" in user description.`);
        }
        if (isImagesRelevant) {
            console.log('Found relevant emoji in images.');
        }
    } else {
        console.log('No relevant content found.');
    }
};

const monitorPageChanges = () => {
    let currentURL = window.location.href;

    const observer = new MutationObserver(() => {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            const existingBadge = document.querySelector('.custom-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            setTimeout(waitForElementsAndRun, 500);
        }
    });

    observer.observe(document, {
        subtree: true,
        childList: true,
    });
};

const waitForElementsAndRun = () => {
    const profileName = document.querySelector('div[data-testid="UserName"]');
    const userDescription = document.querySelector('div[data-testid="UserDescription"]');

    if ((profileName && userDescription) || !profileName || !userDescription) {
        setTimeout(detectAndAddBadge, 500);
    } else {
        setTimeout(waitForElementsAndRun, 500);
    }
};

monitorPageChanges();

setTimeout(waitForElementsAndRun, 500);
