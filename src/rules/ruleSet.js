let ruleSet = new Map([
  [ 'CreateFlat', { name: 'create', target: 'flat' }],
  [ 'EditOwnFlat', { name: 'edit', target: 'flat' ,who: { name: 'seller_id', param: 'user_id' }}],
  [ 'ArchieveOwnFlat', { name: 'archieve', target: 'flat' ,who: { name: 'seller_id', param: 'user_id' }}],
  [ 'SendPM', { name: 'send', target: 'PM' }],
  [ 'LeaveFeedback', { name: 'leave', target: 'feedback' }],
  [ 'ApplyToAgency', { name: 'applyTo', target: 'agency' }],
  [ 'AddFlatToFavorites', { name: 'addToFavorites', target: 'flat' }],
  [ 'SaveSearch', { name: 'save', target: 'search' }],
  [ 'AskToCreateAgency', { name: 'askToCreate', target: 'agency' }],
  [ 'EditOwnProfile', { name: 'editOwn', target: 'profile',who: { name: 'user_id', param: 'user_id' }}],
  [ 'ComplainFlat', { name: 'complain', target: 'flat' }],
  [ 'RewiewAgencyApplications', { name: 'reviewApplications', target: 'agency' }],
  [ 'CreateAgency', { name: 'create', target: 'agency' }],
  [ 'EditAgency', { name: 'edit', target: 'agency' }],
  [ 'InviteUser', { name: 'invite', target: 'user' }],
  [ 'ManageComplaints', { name: 'manage', target: 'complaints' }],
  [ 'ModerateFlats', { name: 'moderate', target: 'flats' }],
  [ 'BlockUser', { name: 'block', target: 'user' }],
  [ 'DeleteUser', { name: 'delete', target: 'user' }],
  [ 'CreateUser', { name: 'create', target: 'user' }],
  [ 'EditUser', { name: 'edit', target: 'user' }],
  [ 'RestoreUser', { name: 'restore', target: 'user' }],
])
export default ruleSet
