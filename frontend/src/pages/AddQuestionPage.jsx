import React from "react";
import QuestionForm from "../components/QuestionForm";
import { ToastContainer } from "react-toastify";

const AddQuestionPage = () => {
    return (
        <div>
            <h1>Thêm Câu Hỏi</h1>
            <QuestionForm />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AddQuestionPage;
