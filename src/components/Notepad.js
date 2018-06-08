/* eslint-disable  no-unused-vars */
import React, { Component } from 'react'; 
import { Text,
		View,
		Animated,
		Image,
		PanResponder,
		Dimensions,
		FlatList,
 } from 'react-native';	
 import { Audio } from 'expo';
 import { CheckBox, Button } from 'react-native-elements'
 import Clue from './Clue'	

 /* eslint-enable no-unused-vars */

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const NOTEPAD_WIDTH = SCREEN_WIDTH * 0.9;
const NOTEPAD_BOUNDARY = SCREEN_HEIGHT*0.65;

// Hay que pasarle los clues como prop llamado clues


export default class Notepad extends Component {

	constructor(props) {
		super(props);
		const midViewOn = false;
		const checked = true;
		const unchecked = false;
		const midViewItem = null;
		const position = new Animated.ValueXY({x: 0, y: SCREEN_HEIGHT});
		const panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gesture) => {
				position.setValue({ y:gesture.moveY- SCREEN_HEIGHT*0.50 });
			},
			onPanResponderRelease: (event, gesture) => {
				if(gesture.moveY < NOTEPAD_BOUNDARY){
					this.onSwipeUp();
				} else if (gesture.moveY > NOTEPAD_BOUNDARY){
					this.onSwipeDown();
				}
			}

		});
		this.state = { panResponder, position, checked, unchecked, midViewOn, midViewItem};
	}


	componentDidMount(){
		this.onSwipeUp();
	}

	renderMidView(item){
		this.setState(previousState => {
        return { midViewOn: !previousState.midViewOn, midViewItem: item };
      });
		
		
	}

	renderMidViewItem(){
		var rend = this.state.midViewOn;
		var item = this.state.midViewItem;
	
		if(rend){
			if(item.type === 'img'){
				console.log(item.clue);
				return (
					<View style={{width: '100%', height: '100%'}}>
						<Image style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={{ uri: item.clue }}/>
					</View>
				);
			}
			else if(item.type === 'text'){
				return (
					<View>
						<Text style={{color: '#ffffff'}}>
							{item.clue}
						</Text>
					</View>
				);
			} else if (item.type === 'location') {
				return (
					<View>
						<Text style={{color: '#ffffff'}}>
							{item.clue}
						</Text>
					</View>
				);
			}
		}

	}

    async playAudio(item) {
		const SoundObject = new Audio.Sound();
		try {
        	await SoundObject.loadAsync({uri: item.clue});
         	await SoundObject.playAsync();
        }
        catch(err){
            //error
        }
	}

	renderClue(item){
		if(item.id < this.props.index){
			return ( 
			<Clue
			key={item.id}
			type={item.type}
			title={item.title}
			description={item.clue}
			checked={this.state.checked}
			/>
			);
		}else if (item.id === this.props.index){
			return(
			<Clue
			key={item.id}
			type={item.type}
			title={item.title}
			description={item.clue}
			checked={this.state.unchecked}
			renderMidView={()=> this.renderMidView(item)}
			playClueAudio={()=> this.playAudio(item)}
			/>
			)
		}
	}

	renderNotepad(){
		return (
                <FlatList
                    data={this.props.clues}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => this.renderClue(item)}
                    extraData={this.props.index}
                />);
	}

	render() {
		return (
		<View style={{ position: 'absolute',top: 0, height: SCREEN_HEIGHT}}>
			<Animated.View
				style={this.state.position.getLayout()}
				{...this.state.panResponder.panHandlers}
			>
			<View style={styles.middleView}>
				{this.props.children}
				{this.renderMidViewItem()}
			</View>
                <View style={styles.tab}>
					<Text style={styles.tabText}>^</Text>
				</View>
				<View style={styles.pad}>
					{this.renderNotepad()}
														<Button 
					raised
					iconRight={{name: 'exit-to-app'}}
					title='Get me out!'
					containerViewStyle={styles.buttonContainerStyle}
					backgroundColor= '#ff0000'
					borderRadius={5}
					onPress={this.props.exitToApp}
					/>
				</View>

			</Animated.View>
		</View>
		);
	}

	onSwipeUp(){
		Animated.spring(this.state.position, {
			toValue: {x: 0, y: SCREEN_HEIGHT*0.075}
		}).start();
	}

	onSwipeDown(){
		Animated.spring(this.state.position, {
			toValue: {x: 0, y: SCREEN_HEIGHT*0.45}
		}).start();
	}

}

const styles = {
	middleView: {
		width: SCREEN_WIDTH*0.9,
		backgroundColor: 'rgba(255,255,255,0)',
		height: SCREEN_HEIGHT*0.35,
		marginTop: SCREEN_HEIGHT*0.1,
		margin: SCREEN_WIDTH*0.05,
		borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
	},
	buttonContainerStyle: {
		borderRadius: 5,
		margin:NOTEPAD_WIDTH*0.025,
		bottom: 0,
		width: NOTEPAD_WIDTH*0.90,
	},
	tab: {
		borderTopRightRadius: 40,
		borderTopLeftRadius: 40,
		marginLeft: SCREEN_WIDTH*0.05,
		width: NOTEPAD_WIDTH,
		backgroundColor: '#f5f5f5',
		height: SCREEN_HEIGHT*0.075,
	},
	pad: {
		borderBottomRightRadius: 10,
		borderBottomLeftRadius: 10,
		marginLeft: SCREEN_WIDTH*0.05,
		width: NOTEPAD_WIDTH,
		backgroundColor: '#f5f5f5',
		height: SCREEN_HEIGHT*0.35
	},
	tabText: {
		textAlign: 'center',
		fontSize: 50,
		color: '#553285'
	},
	padText: {
		fontSize: 16,
	},
};