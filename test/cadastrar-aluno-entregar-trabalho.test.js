import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { getTokenAdmin, getToken } from './helpers/auth.js';
import testesDeEntregaTrabalho from './fixtures/entrega-trabalhos.json' with { type: 'json' };

describe('POST /api/auth/login', () => {
    let tokenAdmin;
    let tokenAluno;

    beforeEach(async () => {
        tokenAdmin = await getTokenAdmin();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    testesDeEntregaTrabalho.forEach(testeDeEntregaTrabalho => {
        it(testeDeEntregaTrabalho.testTitle, async () => {
            // cadastrar aluno
            const cadastroAlunoResposta = await request(app)
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeDeEntregaTrabalho.dadosAluno);

            const alunoId = cadastroAlunoResposta.body.id;

            // cadastrar nova disciplina
            const cadastroDisciplinaResposta = await request(app)
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeDeEntregaTrabalho.dadosDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;

            // cadastrar o novo aluno na nova disciplina
            const cadastroMatriculaRespostas = await request(app)
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send({ alunoId: alunoId });


            // logar como aluno
            tokenAluno = await getToken(testeDeEntregaTrabalho.dadosAluno.email, testeDeEntregaTrabalho.dadosAluno.senha);

            // registrar entrega de um trabalho
            const respostaEntregaTrabalho = await request(app)
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Authorization', `Bearer ${tokenAluno}`)
                .send({
                    disciplinaId: disciplinaId,
                    titulo: testeDeEntregaTrabalho.dadosTrabalho.titulo,
                    descricao: testeDeEntregaTrabalho.dadosTrabalho.descricao
                });


            expect(respostaEntregaTrabalho.status).to.equal(testeDeEntregaTrabalho.statusCodeEsperado);

        });
    });

});
