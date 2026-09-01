import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';

describe('Alunos', () => {
    let token;
    
    beforeEach(async() => {
         token = await getToken('admin@escola.com', 'admin123');
    });

    it('Deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const aluno = {
                nome: 'Daniela Quatro',
                email: 'daniela.quatro@aluno.com',
                matricula: '2094050',
                senha: '123456'
            }
        // Cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(aluno);

        // Validar se ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(`${aluno.nome}`);
        expect(cadastroAlunoResposta.body.email).to.equal(`${aluno.email}`);
        expect(cadastroAlunoResposta.body.matricula).to.equal(`${aluno.matricula}`);
    });

    it('Deve negar o cadastro de um aluno quando ele já existir', async () => {
        // Cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Carla Mendes',
                email: 'carla.mendes@example.com',
                matricula: '2024003',
                senha: '123456'
            });

        // Validar se ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal("Já existe um aluno cadastrado com essa matrícula ou e-mail.");
    });
});