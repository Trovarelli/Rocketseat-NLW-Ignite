import {useEffect, useState} from 'react';
import React from 'react'
import { Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import logoImg from '../../assets/logo-nlw-esports.png'
import { Heading } from '../../components/Heading';
import { GameCard, GameCardProps } from '../../components/GameCard';
import { styles } from './styles';
import { Background } from '../../components/Background';
import { useNavigation } from '@react-navigation/native'

export function Home() {
  const navigation = useNavigation()
  const [games, setGames] = useState<GameCardProps[]>([])

  useEffect(() => {
    fetch('http://192.168.0.103:3333/games').then(response => response.json()).then(data => {
      data.sort((a: { _count: { ads: number; }; }, b: { _count: { ads: number; }; }) => (a._count.ads < b._count.ads ? 1 : -1))
      setGames(data)
    }
  )}, [])

  function handleOpenGame({id, title, bannerUrl}: GameCardProps) {
    navigation.navigate('game', {id, title, bannerUrl})
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Image source={logoImg} style={styles.logo}/>
        <Heading title='Encontre seu duo!' subtitle='Selecione o game que deseja jogar...'/>
        <FlatList contentContainerStyle={styles.contentList} data={games} keyExtractor={item => item.id} renderItem={({item}) => <GameCard data={item} onPress={() => handleOpenGame(item)}/>} horizontal showsHorizontalScrollIndicator={false}/>
      </SafeAreaView>
    </Background>
  );
}