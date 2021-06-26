//icons/images
import logoImg from "../assets/images/logo.svg";
import deleteIcon from "../assets/images/delete.svg";
import checkIcon from "../assets/images/check.svg";
import answerIcon from "../assets/images/answer.svg";
//components
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
//hooks
import { Link, useHistory, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

//services
import { database } from "../services/firebase";
import "../styles/room.scss";

type RoomParams = {
	id: string;
};
export function AdminRoom() {
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const questionsPath = `rooms/${roomId}/questions`;
	const { title, questions, roomOwner } = useRoom(roomId);
	const history = useHistory();
	if (roomOwner !== "" && roomOwner !== user?.id) {
		history.push(`/rooms/${roomId}`);
		return (
			<div className='page-warning-invalid'>
				<h1 className='page-warning-text'>
					Ops... Você não é o dono dessa Sala
				</h1>
				<Button
					onClick={() => history.push(`/rooms/${roomId}`)}
					className='btn btn-warning'
				>
					Voltar
				</Button>
			</div>
		);
	}
	console.log(roomOwner);
	async function handleEndRoom() {
		await database.ref(`rooms/${roomId}`).update({ endedAt: new Date() });
		history.push("/");
	}
	async function handleCheckQuestionAsAnswer(questionId: string) {
		await database.ref(`${questionsPath}/${questionId}`).update({
			isAnswered: true,
		});
	}
	async function handleHighlightQuestion(questionId: string) {
		await database.ref(`${questionsPath}/${questionId}`).update({
			isHighlighted: true,
		});
	}
	async function handleDeleteQuestion(questionId: string) {
		const confirmText =
			"Tem certeza que você deseja excluir esta pergunta?";
		if (window.confirm(confirmText)) {
			await database.ref(`${questionsPath}/${questionId}`).remove();
		}
	}
	return (
		<div id='page-room' className='page-room'>
			<header className='header-container'>
				<div className='header-content'>
					<Link to='/'>
						{" "}
						<img
							src={logoImg}
							alt='let me ask'
							className='header-logo'
						/>
					</Link>

					<div className='header-buttons'>
						<RoomCode code={roomId} />
						<Button onClick={handleEndRoom} isOutlined>
							Encerrar
						</Button>
					</div>
				</div>
			</header>
			<main className='room-container'>
				<div className='room-label'>
					<h1 className='room-title'>{title}</h1>
					{questions.length > 0 && (
						<span className='room-info-highlight'>
							{questions.length} Perguntas
						</span>
					)}
				</div>
				<div className='question-list'>
					{questions.map((question) => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
								isHighlighted={question.isHighlighted}
								isAnswered={question.isAnswered}
							>
								{!question.isAnswered && (
									<>
										<button
											className='btn-icon'
											type='button'
											onClick={() =>
												handleCheckQuestionAsAnswer(
													question.id,
												)
											}
										>
											<img
												src={checkIcon}
												alt='marcar pergunta como respondida'
											/>
										</button>

										<button
											className='btn-icon'
											type='button'
											onClick={() =>
												handleHighlightQuestion(
													question.id,
												)
											}
										>
											<img
												src={answerIcon}
												alt='destacar a pergunta'
											/>
										</button>
									</>
								)}

								<button
									className='btn-icon'
									type='button'
									onClick={() =>
										handleDeleteQuestion(question.id)
									}
								>
									<img
										src={deleteIcon}
										alt='remover a pergunta'
									/>
								</button>
							</Question>
						);
					})}
				</div>
			</main>
		</div>
	);
}
