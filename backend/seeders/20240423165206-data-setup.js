'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Seeders pour la table `role`
    await queryInterface.bulkInsert('role', [
      { label: 'Administrateur' },
      { label: 'Membre' },
      { label: 'Invité' },
      { label: 'Moderateur' },
    ]);

    // Seeders pour la table `user`
    await queryInterface.bulkInsert('user', [
      {
        creation_date: '2023-11-21 15:25:31',
        ddn: 0,
        description: 'Passionné de cuisine, j\'explore sans cesse de nouvelles saveurs. Mes recettes allient fraîcheur, saisonnalité et créativité. Rejoignez-moi pour partager notre amour de la bonne cuisine !',
        pseudo: 'Domov',
        name: 'Ronan',
        surname: 'Scotet',
        picture: 'http://localhost:8081/images/user/ronan.jpg_1697827512275_31.jpg',
        role_id: 1,
        email: 'ronanscotet467@gmail.com',
        password: '$2b$10$bEe/ZhJCVubHJw8Eco4kQ.xeH2NLjzSj8cqKVoxm9GOPmcK8M.yd6'
      },
      {
        creation_date: '2023-11-21 15:25:31',
        ddn: 0,
        description: '',
        pseudo: 'Fabrice92',
        name: 'Fabrice',
        surname: 'Tirel',
        picture: 'http://localhost:8081/images/user/photo_fabrice.png_1698164619352_589.png',
        role_id: 4,
        email: 'fabrice.tirel@reltim.com',
        password: '$2b$10$twh.TiSifVajwEgwIqPup.zLIN8aL3CJhmVzFY.Nzwz5R1/eP9CL6'
      },
      {
        creation_date: '2023-11-21 15:25:31',
        ddn: 0,
        description: '',
        pseudo: 'BastiUI',
        name: 'Bastien',
        surname: 'Marechaud',
        picture: 'https://www.club.reltim.com/wp-content/uploads/2023/01/engineer-1.png',
        role_id: 3,
        email: 'bastien@gmail.com',
        password: '$2b$10$bpskb34MfSmjKgZ6.kLLxu8Q/RYCvrKabFGjiMLqfMIqywoNSOoea'
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
