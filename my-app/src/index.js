import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	if (props.winLine && props.winLine.includes(props.pos)) {
		return (
			<button
				className="square"
				onClick={props.onClick}
				style={{ backgroundColor: 'yellow' }}
			>
				{props.value}
			</button>
		);
	}
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				key={i}
				pos={i}
				value={this.props.squares[i]}
				winLine={this.props.winLine}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	renderBoardRow(i) {
		const squares = [];
		for (let j = 0; j < 3; j++) {
			squares.push(this.renderSquare(i * 3 + j));
		}
		return (
			<div key={i} className="board-row">
				{squares}
			</div>
		);
	}

	render() {
		const boardRows = [];
		for (let i = 0; i < 3; i++) {
			boardRows.push(this.renderBoardRow(i));
		}
		return <div>{boardRows}</div>;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{ squares: Array(9).fill(null), playPos: null }],
			stepNumber: 0,
			xIsNext: true,
			historyOrderIsDesc: false,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares)[0] || squares[i]) return;
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([
				{
					squares: squares,
					playPos: i,
				},
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	render() {
		var history = this.state.history;
		const current = history[this.state.stepNumber];
		const calculateWinnerResult = calculateWinner(current.squares);
		const winner = calculateWinnerResult[0];

		const moves = history.map((step, stepNumber) => {
			const desc = stepNumber
				? stepNumber +
				  '번 턴으로 이동 : (' +
				  (parseInt(step.playPos / 3) + 1) +
				  ',' +
				  ((step.playPos % 3) + 1) +
				  '), ' +
				  (stepNumber % 2 ? 'X' : 'O')
				: '게임 시작으로 이동';
			if (stepNumber === this.state.stepNumber) {
				return (
					<li key={stepNumber}>
						<button onClick={() => this.jumpTo(stepNumber)}>
							<strong>{desc}</strong>
						</button>
					</li>
				);
			}
			return (
				<li key={stepNumber}>
					<button onClick={() => this.jumpTo(stepNumber)}>{desc}</button>
				</li>
			);
		});

		if (this.state.historyOrderIsDesc) {
			moves.reverse();
		}

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else if (this.state.stepNumber >= 9 && !winner) {
			status = 'Draw...';
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						winLine={calculateWinnerResult[1]}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button
						onClick={() =>
							this.setState({ historyOrderIsDesc: !this.state.historyOrderIsDesc })
						}
					>
						↑기록정렬↓
					</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], lines[i]];
		}
	}
	return [null, null];
}

ReactDOM.render(<Game />, document.getElementById('root'));