/* if user writes something (list of toggleable stuff, invites/links/banned words) then delete it, also strikes/timeout system.
Offensive names as well.
User joins/leaves and other events. */

function bans(client, evt) {
  bot.getBans(msg.channel.server, users)
}

function ban(client, evt, suffix) {
  bot.banMember(user, server, length, callback)
  bans a user `@username` `length` (optional)
}

function unban(client, evt, suffix) {
  unbans a user `@username`
}

function kick(client, evt, suffix) {
  kicks a user `@username`
}

function mute(client, evt, suffix) {
  mutes a user (text) (create new role without permissions to speak?) `@username` `time` (optional) (unmute after time elapsed)
}

function unmute(client, evt, suffix) {
  unmutes a user (text) `@username`
}

function deafen(client, evt, suffix) {
  deafens a user (voice) `@username` `time` (optional) (undeafens after time elapsed)
}

function undeafen(client, evt, suffix) {
  undeafens a user (voice) `@username`
}

function addrole(client, evt, suffix) {
  adds a role to a user `@username` `role`
}

function removerole(client, evt, suffix) {
  removes a role from a user `@username` `role`
}

function purge(client, evt, suffix) {
 clears chat messages `count` (default 10?) `@username` (optional)
}

function createchannel(client, evt, suffix) {
  creates a channel `name` `type` (text or voice) (default text)
}

function deletechannel(client, evt, suffix) {
  deletes a channel `name`
}

function deletechannel(client, evt, suffix) {
  moves a user to another voice channel `@usernam` `voice channel name`
}

function createinvite(client, evt, suffix) {
  creates an invitation `channel name` `duration (seconds)` `uses` `temporary true/false` `human readable true/false`
}

function updatechannel(client, evt, suffix) {
  updates a channel `channel name` `new channel name` `new channel topic`
}

function createrole(client, evt, suffix) {
  creates a role `name` `colour` `separated true/false` `permissions` (everything optional) (write !permissions for a list of available permissions)
}

function updaterole(client, evt, suffix) {
  updates a role `name` `colour` `separated true/false` `permissions` (everything optional) (write !permissions for a list of available permissions)
}

function removerole(client, evt, suffix) {
  deletes a role `name`
}

function changepermissions(client, evt, suffix) {
  changes a users permissions `@username` `permission name: true/false` (write !permissions for a list of available permissions)
}

function permissions(client, evt) {
  lists available permissions for !createrole
}

export default {
  bans,
  ban,
  kick,
  mute,
  deafen,
  addrole,
  roleadd: addrole,
  'add-role': addrole,
  'role-add': addrole,
  removerole
  roleremove: removerole,
  'remove-role': removerole,
  'role-remove': removerole,
  purge,
  clear: purge,
  clean: purge,
  createchannel,
  channelcreate: createchannel,
  'create-channel': createchannel,
  'channel-create': createchannel,
  deletechannel: deletechannel,
  channeldelete: deletechannel,
  'delete-channel': deletechannel,
  'channel-delete': deletechannel,
  move,
  createinvite,
  invitecreate: createinvite,
  'create-invite': createinvite,
  'invite-create': createinvite,
  updatechannel,
  channelupdate: updatechannel,
  'update-channel': updatechannel,
  'channel-update': updatechannel,
  createrole,
  rolecreate: createrole,
  'create-role': createrole,
  'role-create': createrole,
  deleterole,
  roledelete: deleterole,
  'delete-role': deleterole,
  'role-delete': deleterole,
  updaterole,
  roleupdate: updaterole,
  'update-role': updaterole,
  'role-update': updaterole,
  changepermissions,
  changeperms: changepermissions,
  'change-permissions': changepermissions,
  'change-perms': changepermissions,
  permissions,
  perms: permissions,
};

export const help = {
  bans: {category: 'moderation'},
  ban: {parameters: [''], category: 'moderation'},
  kick: {parameters: [''], category: 'moderation'},
  mute: {parameters: [''], category: 'moderation'},
  deafen: {parameters: [''], category: 'moderation'},
  addrole: {parameters: [''], category: 'moderation'},
  removerole: {parameters: [''], category: 'moderation'},
  purge: {parameters: [''], category: 'moderation'},
  createchannel: {parameters: [''], category: 'moderation'},
  deletechannel: {parameters: [''], category: 'moderation'},
  move: {parameters: [''], category: 'moderation'},
  createinvite: {parameters: [''], category: 'moderation'},
  updatechannel: {parameters: [''], category: 'moderation'},
  createrole: {parameters: [''], category: 'moderation'},
  deleterole: {parameters: [''], category: 'moderation'},
  updaterole: {parameters: [''], category: 'moderation'},
  changepermissions: {parameters: [''], category: 'moderation'},
  permissions: {category: 'moderation'},
};
