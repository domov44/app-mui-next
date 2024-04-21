const getToken = () => {
    if (typeof document !== 'undefined') {
        // Récupération de tous les cookies si l'objet document est défini
        const allCookies = document.cookie.split('; ');

        // Recherche du cookie avec le nom "token"
        const tokenCookie = allCookies.find(cookie => cookie.startsWith('token='));

        // Si un cookie "token" est trouvé, retourner sa valeur
        if (tokenCookie) {
            const [, token] = tokenCookie.split('=');
            return token;
        }
    }

    // Si aucun token n'est trouvé, retourner null ou une valeur par défaut selon vos besoins
    return null;
};

export default getToken;

