process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const { expect }=require('chai')

chai.use(chaiHttp)

const connectDatabase=()=>{mongoose.connect('mongodb://localhost:27017/testModel' ,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex :true
}).then(con=>{
    console.log(`mongodb database connected with host : ${con.connection.host} `)
})};

describe('checking authentication',()=>{
    let token
    const register='/api/v1/register'
    const login='/api/v1/login'
    const logout='/api/v1/logout'
    const updateTicket='/api/v1/ticket/update/'
    const ticketStatus='/api/v1/ticket/status/'
    const ticketDetailedStatus='/api/v1/ticket/detail-status/'
    const allTickets='/api/v1/ticket/all/'
    const cancelTicket='/api/v1/ticket/cancel/'

    // a temporary user
    const testUser={
        "name":"test user",
        "email":"test@test.com",
        "password":"pass@1234",
        "role":"customer",
        "date_of_travel":"2020-04-18",
	    "validation_id_no":"8299022435"
    }
    const updateBody={
        "gender":"male"
    }

    before('connect to db',(done)=>{
        connectDatabase()
        done()
    })

    // after all test have run we drop our test database
    after('dropping test db', async () => {
        await mongoose.connection.dropDatabase(() => {
            console.log('\n Test database dropped');
        });
        await mongoose.connection.close();
    });
    it('registering user',(done)=>{
        chai.request(server)
            .post(register)
            .send(testUser)
            .end((err,res)=>{
                expect(res).to.be.an('object')
                token='Bearer '
                done()
            })
    })

    // test to check login
    it('checking login',(done)=>{
        chai
        .request(server)
        .post(login)
        .send(testUser)
        .end((err,res)=>{
            if (err) done(err)
            expect(res.status).to.equal(200)
            expect(res.body.success).to.be.true
            token+=res.body.token
        done()
        })
    })
    
    // As now we are logged-in we can test registered user only ticket functions
    describe('since logged-in  testing for ticket functions',()=>{
        let ticket_id;
        // test to check new booking
        it('booking ticket',(done)=>{
            chai
            .request(server)
            .post('/api/v1/ticket/book')
            .set('authorization', token)
            .send(testUser)
            .end((err,res)=>{
                if (err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.success).to.be.true
                expect(res.body.message).to.deep.equal('Ticket Booked')
                expect(res.body.data.status).to.deep.equal('Booked')
                expect(res).to.be.an('object')
                ticket_id=res.body.data._id
            done()
            })
        })
        // test to check updation in ticket
        it('Updating ticket',(done)=>{
            chai
            .request(server)
            .put(updateTicket+ticket_id)
            .set('authorization', token)
            .send(updateBody)
            .end((err,res)=>{
                if (err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.success).to.be.true
                expect(res.body.message).to.deep.equal('updated successfully')
                expect(res.body.data.status).to.deep.equal('Booked')
                expect(res.body.data.gender).to.deep.equal('male')
                expect(res).to.be.an('object')
            done()
            })
        })
        // test to check ticket status
        it('checking ticket status',(done)=>{
            chai
            .request(server)
            .get(ticketStatus+ticket_id)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.success).to.be.true
                expect(res.body.data).to.deep.equal('Booked')
                expect(res).to.be.an('object')
            done()
            })
        })
        // test to check detailed version of ticket status
        it('checking detailed ticket status',(done)=>{
            chai
            .request(server)
            .get(ticketDetailedStatus+ticket_id)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.success).to.be.true
                expect(res.body.data.status).to.deep.equal('Booked')
                expect(res.body.data._id).to.deep.equal(ticket_id)
                expect(res.body.data.name).to.deep.equal(testUser.name)
                expect(res.body.data.validation_id_no).to.deep.equal(testUser.validation_id_no)
                expect(res).to.be.an('object')
            done()
            })
        })
        // test to check all ticket on particular date
        it('checking all tickets function ',(done)=>{
            chai
            .request(server)
            .get(allTickets+testUser.date_of_travel+'/Booked')
            .end((err,res)=>{
                if(err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.success).to.be.true
                expect(res).to.be.an('object')
                expect(res.body.data).to.be.a('Array')
            done()
            })
        })
        // test to cancel the ticket
        it('checking cancellation of ticket ',(done)=>{
            chai
            .request(server)
            .put(cancelTicket+ticket_id)
            .set('authorization', token)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.success).to.be.true
                expect(res.body.data.status).to.deep.equal('Cancelled')
                expect(res.body.data._id).to.deep.equal(ticket_id)
                expect(res.body.data.name).to.deep.equal(testUser.name)
                expect(res.body.data.validation_id_no).to.deep.equal(testUser.validation_id_no)
                expect(res).to.be.an('object')
            done()
            })
        })
    })

    describe('testing for users profile',()=>{
        // test to get user profile
        it('testing for get profile function',(done)=>{
            chai
            .request(server)
            .get('/api/v1/profile')
            .set('authorization', token)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.success).to.be.true
                expect(res).to.be.an('object')
                expect(res.body.data).to.be.an('object')
                expect(res.body.data.name).to.be.equal(testUser.name)
                expect(res.body.data.ticketsHistory).to.be.a('Array')
            done()
        })
    })})
    // test to check logout
    it('checking logout',(done)=>{
        chai
        .request(server)
        .get(logout)
        .set('authorization', token)
        .send(testUser)
        .end((err,res)=>{
            // console.log(res.body)
            if (err) done(err)
            expect(res.status).to.equal(200)
            expect(res.body.success).to.be.true
            expect(res.body.message).to.deep.equal('logged out successful')
            expect(res).to.be.an('object')
        done()
        })
    })

})