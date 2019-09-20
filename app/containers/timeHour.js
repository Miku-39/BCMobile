function timeId(minutes){
  switch(minutes){
    case '00':
      minutes = '3592360180000';
      break;
    case '05':
      minutes = '3592360188000';
      break;
    case '10':
      minutes = '3592360191000';
      break;
    case '15':
      minutes = '3592360193000';
      break;
    case '20':
      minutes = '3685658805000';
      break;
    case '25':
      minutes = '3685658809000';
      break;
    case '30':
      minutes = '3685658810000';
      break;
    case '35':
      minutes = '3685658815000';
      break;
    case '40':
      minutes = '3685658816000';
      break;
    case '45':
      minutes = '3685658818000';
      break;
    case '50':
      minutes = '3685658820000';
      break;
    case '55':
      minutes = '3685658822000';
      break;
  }
  return minutes;
}

function hourId(hours){
  switch(hours){
    case '00':
      hours = '3756497547000';
      break;
    case '01':
      hours = '3756497635000';
      break;
    case '02':
      hours = '3756497718000';
      break;
    case '03':
      hours = '3756497794000';
      break;
    case '04':
      hours = '3756497896000';
      break;
    case '05':
      hours = '3756497978000';
      break;
    case '06':
      hours = '3756498054000';
      break;
    case '07':
      hours = '3756498123000';
      break;
    case '08':
      hours = '3685659141000';
      break;
    case '09':
      hours = '3685659153000';
      break;
    case '10':
      hours = '3685659166000';
      break;
    case '11':
      hours = '3685659176000';
      break;
    case '12':
      hours = '3685659178000';
      break;
    case '13':
      hours = '3685659182000';
      break;
    case '14':
      hours = '3685659186000';
      break;
    case '15':
      hours = '3685659187000';
      break;
    case '16':
      hours = '3685659190000';
      break;
    case '17':
      hours = '3685659195000';
      break;
    case '18':
      hours = '3685659196000';
      break;
    case '19':
      hours = '3756496748000';
      break;
    case '20':
      hours = '3756497113000';
      break;
    case '21':
      hours = '3756497222000';
      break;
    case '22':
      hours = '3756497325000';
      break;
    case '23':
      hours = '3756497446000';
      break;
  }
  return hours;
}

export { timeId, hourId }
