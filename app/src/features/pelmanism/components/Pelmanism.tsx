import React, { useEffect } from "react";
import { usePelmanism } from "../api/getPelmanism";
import { is_set } from "../../../utils/isType";
import { PelmanismItem, PelmanismResponse } from "../types";
import { getRandomValues, shuffleArray } from "../../../utils/array";
import CardImage from "../../../assets/images/Card/cardback.png";
import "../index.css";
import {
  Box, Button, Grid, Modal,
  Typography
} from "@mui/material";
import { GameComponent } from "../../../components/Game";

export function Pelmanism({ pairNumber }: { pairNumber: number }) {
  const [pelmanismItems, setPelmanismItems] = React.useState<PelmanismItem[]>([]);
  const [openItems, setOpenItems] = React.useState<PelmanismItem[]>([]);
  const [isShows, setIsShows] = React.useState<boolean[]>([]);
  const [isResetting, setIsResetting] = React.useState<boolean>(false);
  const pelmanismQuery = usePelmanism();
  const [open, setOpen] = React.useState(false);
  const [isGameFinished, setGameFinished] = React.useState(false);
  const [isGameStarted, setGameStarted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [timeLeft, setTimeLeft] = React.useState(1);
  const [isClickedBackoButton, setisClickedBackoButton] = React.useState(false);
  const [isTimeFinished, setTimeFinished] = React.useState(false)





  useEffect(() => {
    if (isGameStarted) {
      setTimeLeft(25); // 初期化
    }
  }, [isGameStarted]); // ゲーム開始時にtimeLeftを10に初期化

  useEffect(() => {
    if (isGameStarted && timeLeft > 0) { // ゲームが開始され、timeLeftが0より大きい場合にのみカウントダウン処理を実行
      const interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1); // timeLeftを1秒減らす
      }, 1000);

      return () => clearInterval(interval); // アンマウント時にintervalをクリア

    } else if (timeLeft === 0) {
      setTimeFinished(true)
    }
  }, [isGameStarted, timeLeft]);



  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '16px',
  };


  React.useEffect(() => {
    if (is_set<PelmanismResponse[]>(pelmanismQuery.data)) {
      const randomItems = getRandomValues<PelmanismResponse>(pelmanismQuery.data, pairNumber);
      const items = randomItems.map((item) => [{ id: item.id, text: item.kansai }, { id: item.id, text: item.default }]);
      setPelmanismItems(shuffleArray<PelmanismItem>(items.flat()));
      setIsShows(new Array(items.length).fill(false));
    }
  }, [pelmanismQuery.data]);

  const handleButtonClick = (item: PelmanismItem, index: number) => {
    if (isResetting) {
      return;
    }



    const newIsShows = [...isShows];
    newIsShows[index] = true;
    setIsShows(newIsShows);


    if (openItems.length === 0) {
      setOpenItems([item]);
      return;
    }

    if (openItems[0].id === item.id) {
      setScore(score + 1); // スコアを1ふやす
      setOpenItems([]);
      return;
    }

    const resetIsShows = newIsShows.map((value, itemIndex) => pelmanismItems[itemIndex].id === openItems[0].id || pelmanismItems[itemIndex].id === item.id ? false : value);
    setIsResetting(true);





    setTimeout(() => {
      setIsShows(resetIsShows)
      setIsResetting(false);
    }, 1000);

    setOpenItems([]);
  };




  useEffect(() => {
    if (isGameFinished) {
      setisClickedBackoButton(true)
    }
    return
  }, [isGameFinished]);


  if (pelmanismQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!is_set<PelmanismItem[]>(pelmanismQuery.data)) {
    return <div>No pelmanism found</div>;
  }

  if (!isClickedBackoButton) {
    return (
      <Box style={{ backgroundColor: "purple", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Grid container >
          <Grid item xs={8}>
            <Box style={{ display: "flex", flexWrap: "wrap", width: "800px", height: "400px", marginBottom: "20rem" }}>
              {!isTimeFinished && pelmanismItems.map((item, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: "blue", color: "white", position: "relative", width: "120px", height: "240px", margin: "1rem" }}
                  className="pelmanism-button"
                  onClick={() => { handleButtonClick(item, index); }}
                >
                  {isShows[index] ? item.text : <img src={CardImage} style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    height: "100%"
                  }} alt="Card" />} {/* alt属性を追加 */}
                </button>
              ))}
            </Box>
          </Grid>
          <Grid item xs={1}>
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <div style={{ width: "2px", backgroundColor: "black", height: "100%", margin: "auto" }} />
            </div>        
          </Grid>
          <Grid container item xs={3}>
            <Grid item xs={12}>
              <Grid container direction="column" alignItems="center" marginLeft="-4.5rem">
                <Grid item xs={12} sx={{ display: "flex", textAlign: "center", height: "100%" }}><br /><br /></Grid>
                <Grid item xs={12} sx={{ display: "flex", textAlign: "center", height: "100%" }}>
                  <Box style={{ backgroundColor: '#f0f0f0', color: 'black', padding: '5px 15px' }}>
                    スコア
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", textAlign: "center", height: "100%"}} style={{ backgroundColor: '#f0f0f0', color: 'black', padding: '5px 34px'}}>{score}</Box>
                </Grid>
              </Grid>
            </Grid>
            {!isGameStarted && (
              <Grid item marginLeft="1rem"  xs={12}>
                <Button variant="contained" color="warning" onClick={() => setGameStarted(true)} sx={{ fontSize: "25px", position: "relative", width: '250px', height: '100px'}}>
                  <span style={{ color: "white" }}>
                    神経衰弱スタート
                  </span>
                  </Button>
              </Grid>
            )}{(isGameStarted && !isTimeFinished) && (
              <Grid item marginLeft="-2.5rem" xs={12}>
                <Typography variant="h5" align="center">
                  制限時間: {timeLeft}
                </Typography>
              </Grid>)}
              
            {isTimeFinished && (
              <Grid item marginLeft="-2.5rem" xs={12}>
                <Typography variant="h5" align="center">
                  ゲーム終了<br />スコアは{score}です<br />すごろくに戻るボタンを押してください
                </Typography>
              </Grid>)}
            <Grid item marginLeft="4.3rem" xs={12} marginTop={'-30px'}>
              <Button variant="contained" onClick={handleOpen} style={{ fontSize: '20px' }} color="inherit">ルール説明</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                <Typography id="modal-modal-title" align="center" variant="h4" component="h2">
                    ～神経衰弱～<br />
                  </Typography>
                  <Typography id="modal-modal-description" >
                    <br />
                    ・カードのペアは関西弁と標準語<br />
                    例<br />
                    「あかん」＝「だめ」<br />
                    「ちゃう」＝「違う」<br />
                    「ほんま」＝「本当」<br />
                    
                    ・制限時間は20秒<br />
                    ・時間内に獲得したペアに応じてポイントゲット‼‼<br />
                  </Typography>
                  <Typography id="modal-modal-title" align="center"> 
                    5ペア→5ポイント<br />
                    4ペア→4ポイント<br />
                    3ペア→3ポイント<br />
                    2ペア→2ポイント<br />
                    1ペア→1ポイント<br />
                  </Typography>
                  <Box sx={{ textAlign: "right", }}>
                    <Button variant="contained" onClick={handleClose}>閉じる</Button>
                  </Box>
                </Box>
              </Modal>
            </Grid>
            <Grid marginLeft="3rem" item xs={12} marginTop={'-100px'}>
              <Button variant="contained" color="inherit" onClick={() => setGameFinished(true)} style={{ fontSize: '20px' }}>
                <span>
                すごろくに戻る
                </span>
                </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box >
    );
  } else {
    return <GameComponent score={score} />
  }
}
