import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { api } from '../helpers/api.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';

describe('Login + Cadastro Aluno + Cadastro disciplina + Cadastrar aluno na disciplina', () => {
    // pegar token
    let tokenAdmin;
    
    beforeEach(async() => {
         tokenAdmin = await getTokenAdmin();
    });

    it('Deve conseguir cadastrar um novo aluno em uma nova disciplina, passando dados válidos', async () => {
        // Cadastrar novo aluno
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', tokenAdmin)
            .send(novoAluno());

        const alunoId = cadastroAlunoResposta.body.id;

        // cadastrar nova disciplina
        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', tokenAdmin)
            .send(novaDisciplina());

        const disciplinaId = cadastroDisciplinaResposta.body.id;

        // cadastrar o novo aluno na nova disciplina
        const cadastroMatriculaRespostas = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', tokenAdmin)
            .send({alunoId: alunoId});


        // assert
        // validar se alino foi matriculado na disciplina
        expect(cadastroMatriculaRespostas.status).to.equal(201);
        expect(cadastroMatriculaRespostas.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaRespostas.body.disciplinaId).to.equal(disciplinaId);

    });
});