import React from 'react';
import { Alert, FlatList, SafeAreaView } from 'react-native';
import { DefaultStyles, Dialog, MappButton } from './components/MappComponents';

const FetchExample = ()=>{
    const FETCH_CAT_DATA = 'Fetch Cat Data';
    const FETCH_NATIONALIZE_ME_DATA="Fetch Nationalize Me Data";
    const FETCH_MOVIES_SAMPLE="Fetch Movies Sample"


    const fetchData = async (url:string, title:string,)=>{
        const response=await fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(response.ok){
            const data = await response.text();
            console.log(title, data);
            Dialog.show({title:title,message:data,positiveButtonText:"OK",positiveAction:()=>{}});
        }else{
            console.error('Error:', response.statusText);
            Dialog.show({title:'Error', message:'Failed to fetch data', positiveButtonText:"Ok"});
        }
    }

    return(
    <SafeAreaView style={DefaultStyles.sectionContainer}>
              <FlatList
                data={[
                  { key: FETCH_CAT_DATA, url: 'https://catfact.ninja/fact' },
                  { key: FETCH_NATIONALIZE_ME_DATA , url: 'https://api.nationalize.io?name=Semsudin'},
                  {key: FETCH_MOVIES_SAMPLE, url: 'https://reactnative.dev/movies.json'},
                ]}
                renderItem={({ item }) => (
                  <MappButton
                    buttonTitle={item.key}
                    buttonOnPress={() => {
                      fetchData(item.url, item.key);
                    }}
                  />
                )}
              />
    </SafeAreaView>
    );
}

export default FetchExample;