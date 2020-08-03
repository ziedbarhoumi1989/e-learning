const Faker = require('faker');

module.exports.generateFakeUser = _ => {

    let FakeUserData = {
        name: {
            first: Faker.name.firstName(),
            last: Faker.name.lastName()
        },

        email: Faker.internet.email(),

        password: Faker.internet.password(),

        university: Faker.address.state() + " University"

    };

    return FakeUserData;

};