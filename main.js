const SHA256 = require('crypto-js/sha256');

// part 3
class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount; 
  }
}

class Block {
  // constructor(index, timestamp, transactions, previousHash = '') { // percobaan part 1 & 2 menggunakan paraneter 'data' untuk 3 menggunakan 'transaction'. 
    // this.index = index;
    constructor(timestamp, transactions, previousHash = '') { // Untuk parameter index dihilangkan
    this.timestamp = timestamp;
    this.transactions = transactions; // data diganti dengan transaction
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transaction) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: " + this.hash);
  }
}


class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    // this.difficulty = 2; //percobaan pertama
    // this.difficulty = 4; //percobaan kedua
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock(){
    // part 1 & 2
    // return new Block(0, "01/01/2017", "Genesis Block", "0");
    return new Block("01/01/2017", "Genesis Block", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  // part 3 not using this
  // addBlock(newBlock){
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   //part 1
  //   // newBlock.hash = newBlock.calculateHash();
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions); 
    block.mineBlock(this.difficulty);

    console.log('Block Successfully Mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransactions(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }

        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }
}

let savjeeCoin = new Blockchain();

// savjeeCoin.addBlock(new Block(1, "10/07/2017", { amount: 4}));
// savjeeCoin.addBlock(new Block(2, "12/07/2017", { amount: 10}));

// Part 1
//console.log(JSON.stringify(savjeeCoin, null, 4));
// end part 1

// part 2
// console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

// savjeeCoin.chain[1].data = { amount: 100 };
// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash;

// console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());
// end part 2


// part 3
// console.log('Mining Block 1.....');
// savjeeCoin.addBlock(new Block(1, "20/07/2017",{ amount: 4 }));

// console.log('Mining Block 2.....');
// savjeeCoin.addBlock(new Block(2, "20/07/2017",{ amount: 8 }));
// end part 3

savjeeCoin.createTransactions(new Transaction('address1', 'address2', 100));
savjeeCoin.createTransactions(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
savjeeCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is ', savjeeCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
savjeeCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is ', savjeeCoin.getBalanceOfAddress('xaviers-address'));