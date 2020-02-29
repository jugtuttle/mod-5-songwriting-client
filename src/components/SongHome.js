import React, { useState, useEffect, Fragment, version } from 'react'
import { api } from "../services/api";
import DeleteForm from './DeleteForm'
import EditForm from './EditForm'
import VersionsLibrary from './VersionsLibrary'
import NewRecordingDevice from './NewRecordingDevice'
import LyricHelpers from './LyricHelpers'
import LyricSheet from './LyricSheet'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
    root: {
    //   width: '100%',
      padding: '30px',
      backgroundColor: theme.palette.background.paper,
    //   maxHeight: 700,
      flexGrow: 1, 
      overflow: 'auto'
     
    },
  }));

function SongHome(props){
    const [song, setSong] = useState({
        id: null, 
        title: '', 
        lyrics: '', 
        collection_id: null, 
        number_of_versions: null, 
        // versions: [] 
    })
    const [versions, setVersions ] = useState([])
    // const [versions, setVersions] = useState([])
    const [openEditVersion, setOpenEditVersion] = useState(false)
    const [openDeleteVersion, setOpenDeleteVersion] = useState(false)
    const [selectedVersion, setSelectedVersion] = useState('')
    const classes = useStyles();

    useEffect(() => {
        fetchSong()
        // props.onSelectSong(props.match.params.id)
      }, []);

    const fetchSong = () => {
        api.versions.getSongVersions(props.match.params.id)
        .then(res => res.json())
        .then(data => {
            setSong(data.song)
            setVersions(data.versions)
            if (!props.song){
                props.onSelectSong(data.song)
            }
        })
        
    }


    const handleOpenDeleteVersion = (e, version) => {
        setOpenDeleteVersion(!openDeleteVersion)
        setSelectedVersion(version)
    }

    const handleCloseDeleteVersion = () => {
        setOpenDeleteVersion(false)
        setSelectedVersion('')
    }

    const handleOpenEditVerison = (e, version) => {
        console.log('yes')
        setOpenEditVersion(!openEditVersion)
        setSelectedVersion(version)
    }

    const handleCloseEditVersion = () => {
        setOpenEditVersion(false)
        setSelectedVersion('')
    }

    const addVersion = data => {
        setSong(data.song)
        setVersions(data.versions)
        // renderVersions()
        fetchSong()
    }

    const deleteVersion = (id) => {
        api.versions.deleteVersion(id)
        .then(data => (setSong(data.song), setVersions(data.versions)))       
    }

    const editVersion = (title, id) => {
        api.versions.editVersion(id, title)
        .then(data => (setSong(data.song), setVersions(data.versions)))
    }

    return(
        <Fragment>
            {openEditVersion? <EditForm 
                        input={selectedVersion.title} 
                        form='Version' 
                        onCloseForm={handleCloseEditVersion} 
                        id={selectedVersion.id} 
                        onEditInput={editVersion} 
                    /> : null }

            {openDeleteVersion ? <DeleteForm 
                        onDelete={deleteVersion} 
                        onCloseForm={handleCloseDeleteVersion} 
                        id={selectedVersion.id} 
                        title={selectedVersion.title}
                        message={`This will permenently remove this version`} 
                    /> : null}

            <Grid className={classes.root} container spacing={3}>
                <Grid xs={4}>
                    <List component="nav" style={{width: '90%'}}  aria-label="mailbox folders">
                        <h3>Record New Version</h3>
                        <ListItem divider>
                            <ListItemText primary={<NewRecordingDevice onAddVersion={addVersion} songId={props.match.params.id}/>} />
                        </ListItem>          
                        <VersionsLibrary versions={versions} song={song} username={props.username} handleOpenDeleteVersion={handleOpenDeleteVersion} handleOpenEditVerison={handleOpenEditVerison} />
                    </List>
                </Grid>
                <Grid xs={4}>
                    <LyricSheet song={song} />
                </Grid>
                <Grid xs={4}>   
                        <LyricHelpers />
                </Grid>
            </Grid>      
        </Fragment>
    )
}
export default SongHome 
