import "./styles.scss";
import { ReactNode } from "react";
import cx from "classnames";
type QuestionProps = {
	content: string;
	author: {
		name: string;
		avatar: string;
	};
	children?: ReactNode;
	isAnswered?: boolean;
	isHighlighted?: boolean;
};

export function Question({
	content,
	author,
	children,
	isAnswered = false,
	isHighlighted = false,
}: QuestionProps) {
	return (
		<div
			className={cx("question-container", {
				"question-answer": isAnswered,
				"question-highlighted": isHighlighted && !isAnswered,
			})}
		>
			<p className='question-content'>{content}</p>
			<footer className='question-user-container'>
				<div className='question-user-info'>
					<img
						className='user-info-avatar'
						src={author.avatar}
						alt={author.name}
					/>

					<span
						className={cx("question-user-name", {
							"question-user-highlight":
								isHighlighted && !isAnswered,
						})}
					>
						{author.name}
					</span>
				</div>
				<div>{children}</div>
			</footer>
		</div>
	);
}
