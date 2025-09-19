const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); // Import your main app file
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {

  // For cleaning up the database before each test
  beforeEach((done) => {
    // Before each test, we empty the database
    // This requires a setup where you can programmatically clear your test database
    // For example: User.deleteMany({}, (err) => {
    //    done();
    // });
    done();
  });

  /*
  * Test the /POST route for user registration
  */
  describe('/POST register', () => {
    it('it should register a new user', (done) => {
      let user = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        country: "USA",
        income_bracket: "middle"
      }
      chai.request(server)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User registered successfully');
          done();
        });
    });

    it('it should not register a user with an existing email', (done) => {
        // First, create a user
        let user = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            country: "USA",
            income_bracket: "middle"
        }
        // Assuming you have a way to pre-populate your test database
        // new User(user).save();

        chai.request(server)
            .post('/api/auth/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('Email already exists');
                done();
            });
    });
  });

  /*
  * Test the /POST route for user login
  */
  describe('/POST login', () => {
    it('it should login a user with correct credentials', (done) => {
        // First, ensure a user is registered to test login
        let user = {
            email: "test@example.com",
            password: "password123"
        };

      chai.request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token'); // Assuming you return a JWT token
          done();
        });
    });

    it('it should not login a user with incorrect password', (done) => {
        let user = {
            email: "test@example.com",
            password: "wrongpassword"
        };
      chai.request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Invalid credentials');
          done();
        });
    });
  });
});