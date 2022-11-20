export const mean = (arr: number[]) => {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total / arr.length;
};

export const median = (arr: number[]) => {
  const { length } = arr;

  arr.sort((a, b) => a - b);

  if (length % 2 === 0) {
    return (arr[length / 2 - 1] + arr[length / 2]) / 2;
  }

  return arr[(length - 1) / 2];
};

// 60 colors
export const colorListHeatMap = [
  '#00009a',
  '#0200ad',
  '#0000bc',
  '#0000cf',
  '#0000de',
  '#0401ee',
  '#0000fe',
  '#000fff',
  '#001ffe',
  '#022eff',
  '#003fff',
  '#004eff',
  '#005ffe',
  '#0071fe',
  '#0185fd',
  '#0298ff',
  '#02acff',
  '#00bfff',
  '#03cfff',
  '#02dfff',
  '#00effc',
  '#01ffff',
  '#0fffee',
  '#1fffdd',
  '#30fece',
  '#3dffbf',
  '#4ffeaf',
  '#5ffe9d',
  '#71fe8e',
  '#85fe77',
  '#97fe67',
  '#aaff50',
  '#beff41',
  '#cfff2e',
  '#e0ff1f',
  '#eeff0b',
  '#ffff01',
  '#fdef01',
  '#ffdf00',
  '#ffcf00',
  '#fcbf00',
  '#ffaf00',
  '#fea002',
  '#ff8f00',
  '#fe8000',
  '#fd6802',
  '#fc5501',
  '#ff4000',
  '#fe2f02',
  '#ff1e00',
  '#ff0e02',
  '#fe0000',
  '#ec0100',
  '#de0101',
  '#cf0000',
  '#be0002',
  '#ae0001',
  '#a00000',
  '#8e0100',
  '#790304',
];

// TODO Function

// take min, max and length of color list and create intervales for the heatmap
// array type [{from: 1139,to: 1155, color: '#880015',}, {from: from(n-1) +1,to: 1155, color: '#880015',}]
export interface HeatMapColorInterval {
  from: number;
  to: number;
  color: string;
}

export function heatMapGetIntervalData(min: number, max: number) {
  let arrHeatColorInfo: HeatMapColorInterval[] = [];

  let step = (max - min) / colorListHeatMap.length;

  let arrRangeValueList = colorListHeatMap.map(
    (col, index) => min + step * index
  );

  for (let index = 0; index < arrRangeValueList.length - 1; index++) {
    arrHeatColorInfo.push({
      from: arrRangeValueList[index],
      to: arrRangeValueList[index + 1],
      color: colorListHeatMap[index],
    });
  }

  return arrHeatColorInfo;
}

/* export function changeGroupDataToPercentage(
  groupObj: GroupUserData,
  uniqDateList: string[]
) {
  let newObj = {}

  uniqDateList.forEach((dateStr,index,uniqDateList) => {
    if (index != 0){
      newObj = {dateStr: }
    }

  });


  }
} */
