import React, {useState, useEffect} from "react";
import "./Home.css"
import Logo  from "./icon.png"
import { FaSearch } from 'react-icons/fa';
import { AiOutlinePlusSquare, AiFillFolder } from "react-icons/ai"
import {db, storage, auth} from "./firebase"
import {BsCameraVideo, BsDownload, BsImage} from "react-icons/bs"


function Home(props){

    const[progress, setProgress] = useState(0);
    const[arquivos, setArquivos] = useState([]);


    useEffect(()=>{
        db.collection("drive").doc(props.login.uid).collection("files").onSnapshot((snapshot)=>{
            setArquivos(snapshot.docs.map(l=>{
                return l.data();
            }));
        })
    }, [props])

    function fazerUploadArquivo(uid){
        let arquivo = document.querySelector("[name=arquivo]").files[0];
        const uploadTask = storage.ref("drive/"+ arquivo.name).put(arquivo);

        uploadTask.on("state_changed", (snapshot)=>{
            const progressTemp = (snapshot.bytesTransferred/snapshot.totalBytes) *1;
            setProgress(progressTemp)
        },
        function(error){

        },
        
        function(){
            storage.ref("drive/"+arquivo.name).getDownloadURL().then((url)=>{
                db.collection("drive").doc(uid).collection("files").add({
                    arquivoURL: url,
                    tipo_arquivo: arquivo.type,
                    nome: arquivo.name
                })
            })
            alert("Upload realizado com sucesso!")
            setProgress(0)

        })
    }

    function sair(e){
        e.preventDefault();
        auth.signOut().then(()=>{
            alert("Deslogado!")
            window.location.href=""
        }).catch((error) =>{

        })
    }


    return(
        <div className="home">
            <div className="header">
                <div className="header_logo">
                    <img src={Logo}/>
                </div>
                <div className="header_pesquisa">
                    <FaSearch className="search_logo"/>
                    <input placeholder=" O que voce quer buscar?" type="text"></input>
                </div>
                <div className="header_user">
                    <img src={props.login.imagem}/>
                    <a onClick={(e)=>sair(e)} href="#">Sair</a>
                </div>
            </div>
            <div className="main">
                <div className="main_sidebar">
                    <div className="dowload_progress">
                        {
                            (progress > 0)?
                            <div>
                                <label for="file">Dowloading Progress:</label>
                                <progress id="file" value={progress} max="1">{progress}%</progress>
                            </div>
                            :
                            <div></div>
                        }
                    </div>

                    <form>
                        <label className="main_btnFileSelect" for="arquivo"><AiOutlinePlusSquare className="plus_logo" /> NOVO</label>
                        <input onChange={() =>fazerUploadArquivo(props.login.uid)} id="arquivo" className="hidden-input" type="file" name="arquivo"/>
                    </form>
                    <div className="main_folders">
                        <div className="main_folderMeuDrive">
                            <AiFillFolder/><span>Meu Drive</span>
                        </div>

                    </div>
                </div>
                <div className="main_content">
                    <div className="mainTopoText">
                        <h2>Meu Drive</h2>
                    </div>
                    <div className="boxFiles">
                        {
                            arquivos.map(function(data){
                                if (data.tipo_arquivo == "video/mp4"){
                                return(
                                    <div className="boxFileSingle">
                                        <div className="iconDownload">
                                            <BsCameraVideo/>
                                        </div>
                                        <a href={data.arquivoURL}>
                                            <p>{data.nome}</p>
                                        </a>
                                    </div>
                                )
                                }else{
                                    return(
                                        <div className="boxFileSingle">
                                            <div className="iconDownload">
                                                <BsImage/>
                                            </div>
                                            <a href={data.arquivoURL}>
                                                <p>{data.nome}</p>
                                            </a>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>

            </div>
        </div>
    );

}

export default Home;