import { MainLayout } from "../components/Layout/MainLayout";
import * as React from 'react';
import '../index.css';
import { GameComponent } from "../components/Game";
import Background from '../assets/images/Background/background.png';
import {
    Box,
    Button,
    Grid,
    Modal,
    Typography
} from "@mui/material";
import { Pelmanism } from "../features/pelmanism";
import { Bokes } from "../features/bokes";
import { Quizzes } from "../features/quizzes";

const head = () => {
    return (
        <link href="https://fonts.googleapis.com/css2?family=Aoboshi+One&family=Dela+Gothic+One&family=DotGothic16&family=Kiwi+Maru:wght@500&family=Mochiy+Pop+P+One&family=Zen+Antique&family=Zen+Kurenaido&display=swap" rel="stylesheet"></link>
    );
};

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

const closebutton = {
    textAlign: "right",
};

export const Home = () => {
    const [isFullScreen, setIsFullScreen] = React.useState<boolean>(document.fullscreenElement ? true : false);
    const [open, setOpen] = React.useState(false);
    const handleGameStart = () => {
        setIsFullScreen(true);
    }

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const HomeComponent = () => (
        <Box>
            <Grid container direction="column" alignItems="center" spacing={2}>
                <Grid item xs={12} style={{ marginTop: '30%' }}>
                    <Button variant="contained" color="success" size="large" onClick={() => handleGameStart()}>ゲームスタート</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color='inherit' size="large" onClick={handleOpen}>ルール</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color='inherit' size="large" href="/games">ミニゲーム</Button>
                </Grid>
            </Grid>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" align="center" variant="h4" component="h2">
                        ⚁ルール⚂
                    </Typography>
                    <Typography id="modal-modal-description" align="center" sx={{ mt: 2 }}>
                        <b>関西の観光地をすごろくでまわろう‼‼</b><br />
                    </Typography>
                    <Typography id="modal-modal-description" >
                        <br />
                        ・対戦人数は4人<br />
                        ・先頭のプレイヤーがゴールに到達するとゲーム終了<br />
                        ・青マスがノーマルマス、赤マスがイベントマス<br />
                        ・イベントマスに止まるとミニゲームスタート！<br />
                        ・ミニゲームで勝利するとポイントゲット！<br />
                        ・勝敗はポイントが一番多い人が勝利<br />
                        <br />

                        <strong>ミニゲームでたくさん勝利してポイントを稼ごう‼‼‼<br /></strong>
                    </Typography>
                    <Box sx={closebutton}>
                        <Button variant="contained" onClick={handleClose}>閉じる</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );

    return (
        <MainLayout title={"関西双六 - " + (isFullScreen ? "ゲーム" : "ようこそ！")} head={head()}>
            {isFullScreen ? <GameComponent /> : HomeComponent()}
        </MainLayout>
    )
}
