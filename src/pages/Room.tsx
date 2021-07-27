import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
// icons/images
import logoImg from "../assets/images/logo.svg";
// components
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};
export function Room(): JSX.Element {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);
  const questionsPath = `rooms/${roomId}/questions`;
  async function handleCreateNewQuestion(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() === "") return;
    if (!user) {
      throw new Error("you must be logged in");
    }
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };
    await database.ref(questionsPath).push(question);

    setNewQuestion("");
  }
  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      await database
        .ref(`${questionsPath}/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`${questionsPath}/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }
  return (
    <div id="page-room" className="page-room">
      <header className="header-container">
        <div className="header-content">
          <Link to="/">
            {" "}
            <img src={logoImg} alt="let me ask" className="header-logo" />
          </Link>
          <RoomCode code={roomId} />
        </div>
      </header>
      <main className="room-container">
        <div className="room-label">
          <h1 className="room-title">{title}</h1>
          {questions.length > 0 && (
            <span className="room-info-highlight">
              {questions.length} Perguntas
            </span>
          )}
        </div>
        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            className="room-textarea"
            placeholder="Faça sua pergunta"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info-container">
                <img
                  className="user-info-avatar"
                  src={user.avatar}
                  alt={user.name}
                />
                <span className="user-info-name">{user.name}</span>
              </div>
            ) : (
              <span className="login-container">
                Para enviar uma pergunta,
                <button className="link">faça login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isHighlighted={question.isHighlighted}
              isAnswered={question.isAnswered}
            >
              {!question.isAnswered && (
                <button
                  className={`btn-icon btn-like ${
                    question.likeId ? "btn-liked" : ""
                  }`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() =>
                    handleLikeQuestion(question.id, question.likeId)
                  }
                >
                  {question.likeCount > 0 && <span>{question.likeCount}</span>}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="like-icon-path"
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
