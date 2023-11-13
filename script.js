document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const progressBar = document.getElementById('progressBar');
    let currentQuestionIndex = 0;
    const myQuestions = [
        {
            question: "Exploring a new crypto project, do you tend to:",
            scale: {
                1: "Primarily analyze its market potential and practical use.",
                2: "Lean more towards analyzing practical use.",
                3: "Equally consider practical use and technological innovation.",
                4: "Lean more towards being intrigued by technology and possibilities.",
                5: "Primarily get intrigued by its technology and futuristic possibilities."
            }
        },
        {
            question: "In fluctuating markets, do you:",
            scale: {
                1: "Mainly rely on data and analytical tools for decision-making.",
                2: "Mostly use data but sometimes trust your intuition.",
                3: "Balance between data analysis and intuition.",
                4: "Mostly trust your intuition but occasionally refer to data.",
                5: "Mainly trust your intuition and broader market trends."
            }
        },
        {
            question: "When working with blockchain technology, do you:",
            scale: {
                1: "Strongly prefer established methods and protocols.",
                2: "Generally follow established methods with some openness to innovation.",
                3: "Equally value established methods and innovative approaches.",
                4: "Generally experiment with new approaches but respect established methods.",
                5: "Strongly enjoy experimenting with new, innovative approaches."
            }
        },
        {
            question: "In team discussions about crypto strategy, are you more:",
            scale: {
                1: "Predominantly vocal and directive in sharing ideas.",
                2: "Often vocal with occasional reflective insights.",
                3: "Balanced in vocal direction and reflective contributions.",
                4: "Often reflective with occasional input in discussions.",
                5: "Predominantly reflective and insightful in your contributions."
            }
        },
        {
            question: "Evaluating new tokens or ICOs, do you:",
            scale: {
                1: "Mainly focus on past performance and detailed analysis.",
                2: "Tend to look at past data but also consider potential.",
                3: "Balance analysis of past performance with future prospects.",
                4: "Tend to consider future potential but also look at past data.",
                5: "Mainly focus on their potential impact and future prospects."
            }
        },
        {
            question: "During unexpected market shifts, do you:",
            scale: {
                1: "Seek advice and insights from your network.",
                2: "Often consult others but also do your own analysis.",
                3: "Balance between independent analysis and seeking advice.",
                4: "Mostly rely on your own analysis with occasional external inputs.",
                5: "Prefer to analyze the situation on your own."
            }
        },
        {
            question: "Facing technical challenges in crypto, do you:",
            scale: {
                1: "Stick to known solutions and best practices.",
                2: "Usually stick to known solutions but sometimes try new ideas.",
                3: "Balance between tried-and-true and new, innovative solutions.",
                4: "Often try new ideas but keep known solutions as a backup.",
                5: "Create innovative solutions and try new ideas."
            }
        },
        {
            question: "Making investment choices, do you:",
            scale: {
                1: "Base decisions on logical analysis and data.",
                2: "Mostly use data with some consideration for social implications.",
                3: "Balance between data-driven decisions and ethical considerations.",
                4: "Consider social and ethical implications but also look at data.",
                5: "Consider the social and ethical implications."
            }
        },
        {
            question: "Managing your crypto portfolio, are you:",
            scale: {
                1: "Methodical and goal-oriented in your approach.",
                2: "Mostly methodical with some flexibility.",
                3: "Balance between a structured and adaptable approach.",
                4: "Flexible in your approach but with some methodical aspects.",
                5: "Flexible and adaptable to market changes."
            }
        },
        {
            question: "In collaborative crypto projects, do you:",
            scale: {
                1: "Take charge and coordinate efforts.",
                2: "Often lead but also listen to others.",
                3: "Balance between leading and collaborating.",
                4: "Contribute knowledge while supporting others' lead.",
                5: "Contribute specialized knowledge and expertise."
            }
        }
    ];

    const userAnswers = new Array(myQuestions.length);
    let web3;
    let userAccount;

    function buildQuiz() {
        showQuestion(currentQuestionIndex);
    }

    function updateProgressBar(questionIndex) {
        // Adjusted to start at 0% on the first question
        const progressPercent = (questionIndex / (myQuestions.length - 1)) * 100;
        progressBar.style.width = progressPercent + '%';
    }
    
    function showQuestion(questionIndex) {
        updateProgressBar(questionIndex);
    
        const question = myQuestions[questionIndex];
        const scale = question.scale;
        const answers = Object.keys(scale).map(key => 
            `<div class="Answers-Container">
                <label class="Labels">
                    <input type="radio" name="question${questionIndex}" value="${key}">
                    ${scale[key]}
                </label>
            </div>`
        ).join('');
    
        quizContainer.innerHTML = `
            <div class="question"><strong>${question.question}</strong></div>
            <div class="answers">${answers}</div>
        `;
    
        const nextButton = document.createElement('button');
        nextButton.textContent = questionIndex < myQuestions.length - 1 ? 'Next' : 'Show Results';
        nextButton.addEventListener('click', () => {
            if (isAnswerSelected(questionIndex)) {
                saveAnswer(questionIndex);
                if (questionIndex < myQuestions.length - 1) {
                    showQuestion(questionIndex + 1);
                } else {
                    quizContainer.innerHTML = ''; // Clear the quiz container
                    progressBar.style.display = 'none'; // Hide the progress bar
                    createConnectWalletButton();
                }
            } else {
                alert("Please select an answer before continuing.");
            }
        });
        quizContainer.appendChild(nextButton);
    }
    
    function isAnswerSelected(questionIndex) {
        const selector = `input[name=question${questionIndex}]:checked`;
        return quizContainer.querySelector(selector) != null;
    }

    function saveAnswer(questionIndex) {
        const selector = `input[name=question${questionIndex}]:checked`;
        const userAnswer = (quizContainer.querySelector(selector) || {}).value;
        userAnswers[questionIndex] = userAnswer;
    }

    function createConnectWalletButton() {
        const connectWalletButton = document.createElement('button');
        connectWalletButton.textContent = 'Connect Wallet';
        connectWalletButton.id = 'connectWallet';
        resultsContainer.appendChild(connectWalletButton);

        connectWalletButton.addEventListener('click', async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    web3 = new Web3(window.ethereum);
                    userAccount = accounts[0];
                    console.log('Wallet connected: ', userAccount);
                    requestTransaction();
                } catch (error) {
                    console.error('User denied account access');
                }
            } else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        });
    }

    function requestTransaction() {
        resultsContainer.innerHTML = 'Confirm transaction of 0.01 ETH to reveal results.';
    
        const transactionParameters = {
            to: '0xC4a3292D86647E50C23b0f407768B0A47CC8c36E', // Replace with your Ethereum address
            from: userAccount,
            value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')) // Transaction value: 0.01 ETH
        };
    
        ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            })
            .then((txHash) => {
                console.log('Transaction hash:', txHash);
                // Check the transaction status
                checkTransactionStatus(txHash);
            })
            .catch((error) => {
                console.error(error);
                resultsContainer.innerHTML = 'Transaction failed. Please try again.';
            });
    }
    
    function checkTransactionStatus(txHash) {
        web3.eth.getTransactionReceipt(txHash, (err, txReceipt) => {
            if (err) {
                console.error(err);
                resultsContainer.innerHTML = 'Error fetching transaction receipt. Please try again.';
                return;
            }
    
            if (txReceipt && txReceipt.status) {
                console.log('Transaction successful:', txReceipt);
                showResults(); // Show results only if the transaction was successful
            } else {
                console.log('Transaction failed or pending:', txReceipt);
                resultsContainer.innerHTML = 'Transaction failed or is still pending. Please wait or try again.';
            }
        });
    }
    
    function calculateMbtiType(responses) {
        const dichotomies = ["EI", "SN", "TF", "JP"];
        let mbtiType = '';

        for (let i = 0; i < dichotomies.length; i++) {
            const averageResponse = (responses[i] + responses[i + dichotomies.length]) / 2;

            if (averageResponse <= 2.5) {
                mbtiType += dichotomies[i][0];
            } else {
                mbtiType += dichotomies[i][1];
            }
        }

        return mbtiType;
    }

    function showResults() {
        const responses = userAnswers.map(answer => parseInt(answer, 10));
        const mbtiType = calculateMbtiType(responses);
        resultsContainer.innerHTML = `Your Crypto Archetype is: ${mbtiType}`;
    }

    buildQuiz();
});
