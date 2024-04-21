function convertirFormatDate(dateMySQL) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    
    const dateISO = new Date(dateMySQL);
    let dateFormatee = dateISO.toLocaleDateString('fr-FR', options);

    // Vérifier si le jour est égal à 1 et ajuster la dateFormatee en conséquence
    if (dateISO.getDate() === 1) {
        dateFormatee = dateFormatee.replace('1', '1er');
    }

    return dateFormatee;
}

export { convertirFormatDate };
