import "../styles/auth.scss";

import { useHistory } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
export function Home() {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();

	const [roomCode, setRoomCode] = useState("");

	async function handleCreateRoom() {
		if (!user) await signInWithGoogle();

		history.push("/rooms/new");
	}
	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if (roomCode.trim() === "") return;
		const path = `rooms/${roomCode}`;
		const roomRef = await database.ref(path).get();
		if (!roomRef.exists()) {
			alert("Essa sala não existe!");
			return;
		}
		if (roomRef.val()?.endedAt) {
			alert("Essa sala ja foi encerrada!");
			return;
		}
		history.push(path);
	}
	return (
		<div id='page-auth' className='page-auth'>
			<aside className='aside-container'>
				<img
					className='illustration'
					src={illustrationImg}
					alt='Ilustração simbolizando perguntas e respostas'
				/>
				<strong className='aside-title'>
					Crie salas de perguntas em tempo real
				</strong>
				<p className='aside-description'>
					Tire as dúvidas de sua audiência
				</p>
			</aside>
			<main className='home-main-container'>
				<div className='home-main-content'>
					<img src={logoImg} alt='LetMeAsk' className='logo' />
					{!user ? (
						<Button
							onClick={handleCreateRoom}
							className='btn btn-create-room'
						>
							<img
								className='btn-image'
								src={googleIconImg}
								alt='Logo do Google'
							/>
							Crie sua sala com o Google
						</Button>
					) : (
						<Button
							onClick={handleCreateRoom}
							className='btn btn-create-room'
						>
							Crie uma nova sala
						</Button>
					)}
					<div className='separator'>ou entre em uma sala</div>
					<form onSubmit={handleJoinRoom}>
						<input
							type='text'
							placeholder='Digite o código da sala'
							onChange={(event) =>
								setRoomCode(event.target.value)
							}
							value={roomCode}
						/>
						<Button type='submit'>Entrar na Sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
