import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import sinon from 'sinon';
import authService from '../../src/services/auth.service.js';

describe('Login', () => {

    it('deve retornar 500 quando acontecer algum problema de conexão com o banco de dados', async () => {
        const authServiceMock = sinon.stub(authService, 'login');
        authServiceMock.throws(new Error('Erro catastófico!'));
        
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        expect(loginResposta.status).to.equal(500);
        expect(loginResposta.body.error).to.equal('Erro interno do servidor.');

        sinon.restore();
    });

    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        expect(loginResposta.status).to.equal(200);
        expect(loginResposta.body.usuario.email).to.equal('admin@escola.com');
    });

    it('Deve retornar 400 e mensagem de erro quando a senha nã for informada', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                'email': 'errado@escola.com',
                'senha': ''
            });

        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });

    it('Deve retornar 401 e mensagem de erro quando o usuáro estiver correto mas a senha for incorreta', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                'email': 'admin@escola.com',
                'senha': '123123'
            });

        expect(loginResposta.status).to.equal(401);
        expect(loginResposta.body.error).to.equal('E-mail ou senha inválidos.');
    });
});