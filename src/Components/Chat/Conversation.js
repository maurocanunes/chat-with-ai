import React, { useEffect, useState } from 'react';
import OpenAI from "openai";
import useSpeechToText from 'react-hook-speech-to-text';
import LoadingSpinner from '../Screen/LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


const Conversation = () => {
    const { API_KEY } = process.env;
    alert(API_KEY);
    const openai = new OpenAI({apiKey: API_KEY});
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const utterance = new SpeechSynthesisUtterance()
    utterance.lang = "pt-BR";
    /**
     * TODO: implement commands using the commands list in ././Config/Commands.js
     */
    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    useEffect(() => {

        const typingTimeout = setTimeout(() => {
            setIsTyping(false);
          }, 4000);
          
          const chat = async () => {
            try {
                const completion = await openai.chat.completions.create({
                messages: conversation,
                model: "gpt-3.5-turbo",
                
                });
                const content = completion.choices[0]?.message?.content
                if (content) {
                    const updatedMessages = [...conversation, completion.choices[0].message];
                    utterance.text = content;
                    handlePlay();
                    setConversation(updatedMessages);
                    setNewMessage('');
                    setIsTyping(false);
                }
            } catch(err) {
                console.log(err)
            }
        }

        if (conversation.length > 0 && conversation[conversation.length-2]?.role !== 'user') {
            console.log(conversation)
            setIsTyping(true)
            chat();
        }
        
        if(results.length > 0) {

            const latestResult = results[results.length - 1]
            setResults([])
            // setNewMessage(latestResult.transcript)
            handleSendMessage(latestResult.transcript)
        }
        if (isRecording) {
            setIsTyping(true)
        }
        return () => {
            clearTimeout(typingTimeout);
        };
    },[messages, newMessage, results, isRecording])

    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;


    const handlePlay = () => {
        stopSpeechToText();
        const synth = window.speechSynthesis;
        synth.cancel();

        synth.speak(utterance);
    };

    utterance.addEventListener('end', (event) => {

        startSpeechToText();
    })

    

    const handleSendMessage = (voiceMessage='') => {
        setIsTyping(false);
        if (voiceMessage === '' && newMessage === '') {
            return
        }
        const updatedMessages = [...conversation, { content: voiceMessage !== '' ? voiceMessage : newMessage, role: 'user', name:'mauro' }];
        setConversation(updatedMessages);
        setMessages({ content: voiceMessage !== '' ? voiceMessage : newMessage, role: 'user' });
        setNewMessage('');
    };

    return (
    <>
        <div className={'ba b--white shadow-2 vh-100 w-100 overflow-auto absolute'}>
            
            {conversation.map((message, index) => (
                <div key={index} className={ message.role === 'user' ? 'ba b--green br3 shadow-1 mw-5 ml7 tr ' : 'ba b--blue br3 shadow-1 mw-5 ml0 tl' }>
                    <p>{message.name ? message.name.charAt(0).toUpperCase() + message.name.slice(1) + ': ' : 'Sistema: '}
                        {message.content}
                    </p>
                </div>
                ))}
            {isTyping && <div> <LoadingSpinner /> </div>}   
            <Button variant="success" className='br-pill' onClick={isRecording ? stopSpeechToText : startSpeechToText}>{isRecording ? 'Parar' : 'Gravar'}</Button>

                
        </div>
    </>
    );
};

export default Conversation;
