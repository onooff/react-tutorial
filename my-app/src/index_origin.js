import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
// 	// constructor(props) {
// 	// 	super(props);
// 	// 	this.state = {
// 	// 		value: null,
// 	// 	};
// 	// }
// 	render() {
// 		return (
// 			// <button className="square" onClick={function() { console.log('click'); }}>
// 			// <button className="square" onClick={() => console.log('click')}>
// 			<button className="square" onClick={() => this.props.onClick()}>
// 				{/*this.props.value*/}
// 				{this.props.value}
// 			</button>
// 		);
// 	}
// }

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		squares: Array(9).fill(null),
	// 		xIsNext: true,
	// 	};
	// }

	renderSquare(i) {
		// return <Square value={i} />;
		return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{ squares: Array(9).fill(null) }],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		/*
		 .slice() 사용한 이유?
		 state의 squares를 직접 건드리지 않고 사본을 생성하기 위함. 왜???????
		 불변성을 위해서
		 직접 객체 변경을 하지 않고 사본으로 대체함으로써 얻는 이점
		 - 이전 이력을 기억하는 등 로직에서 재사용 유리함
		 - 변화 감지가 쉽다. 값만 변경했을 때는 변경된 값 확인을 위해서 전체 객체 트리를 돌아야 하지만 불변 객체임이 보장되면 객체가 바뀌면 변화로 인식하면 간단함
		 - 렌더링 시기를 결정한다. 이게 중요한 거 같따 성능 이슈와 관련 있을 듯
		   순수 컴포넌트?
		   https://ko.reactjs.org/docs/optimizing-performance.html#examples
		*/
		if (calculateWinner(squares) || squares[i]) return;
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([
				{
					squares: squares,
				},
			]),
			/*
			주의
			배열 push() 함수와 같이 더 익숙한 방식과 달리 concat() 함수는 기존 배열을 변경하지 않기 때문에 이를 더 권장합니다.
			*/
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
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ? move + '번 턴으로 이동' : '게임 시작으로 이동';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
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
			return squares[a];
		}
	}
	return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));