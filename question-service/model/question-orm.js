import { createQuestion, deleteQuestion, findQuestionRandomly } from './repository.js';

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateQuestion(QuestionTitle, QuestionBody, QuestionDifficulty) {
    try {
        const newQuestion = await createQuestion({ QuestionTitle, QuestionBody, QuestionDifficulty });
        newQuestion.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new Question');
        return { err };
    }
}

export async function ormDeleteQuestion(QuestionTitle) {
    try {
        const deletedQuestion = await deleteQuestion(QuestionTitle);
        console.log(deletedQuestion);
        if (deletedQuestion) {
            return true;
        }
        return false;
    } catch (err) {
        console.log('ERROR: Could not delete Question');
        return { err };
    }
}

export async function ormUpdateQuestion(Question, changes) {
    try {
        const { QuestionTitle, QuestionBody, QuestionDifficulty } = changes;
        const updatedQuestion = Question;
        updatedQuestion.QuestionTitle = QuestionTitle;
        updatedQuestion.QuestionBody = QuestionBody;
        updatedQuestion.QuestionDifficulty = QuestionDifficulty;
        updatedQuestion.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not update Question');
        return { err };
    }
}

export async function ormFindQuestionRandomly(difficulty, title = null) {
    try {
        const params = {};
        if (title) {
            params['QuestionTitle'] = { $ne: title };
        }

        if (difficulty) {
            params['QuestionDifficulty'] = difficulty;
        }

        const question = await findQuestionRandomly(params);
        return question;
    } catch (err) {
        console.log('ERROR: Could not find Question');
        return { err };
    }
}

export async function ormCheckQuestionExists(QuestionTitle) {
    try {
        const question = await ormFindQuestion(QuestionTitle);
        console.log(question);
        if (question) {
            return true;
        }
        return false;
    } catch (err) {
        console.log('ERROR: Could not check for Question');
        return { err };
    }
}
