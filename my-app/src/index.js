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
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true,
		};
	}

	handleClick(i) {
		const squares = this.state.squares.slice();
		if (calculateWinner(squares) || squares[i]) return;
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
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			squares: squares,
			xIsNext: !this.state.xIsNext,
		});
	}

	renderSquare(i) {
		// return <Square value={i} />;
		return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div>
				<div className="status">{status}</div>
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
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board />
				</div>
				<div className="game-info">
					<div>{/* status */}</div>
					<ol>{/* TODO */}</ol>
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