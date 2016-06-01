if user writes something (list of toggleable stuff, invites/links/banned words) then delete it, also strikes/timeout system.
Offensive names as well.
User joins/leaves and other events.

function bans(bot, msg) {
  bot.getBans(msg.channel.server, users)
}

function ban(bot, msg, suffix) {
  bot.banMember(user, server, length, callback)
  bans a user `@username` `length` (optional)
}

function unban(bot, msg, suffix) {
  unbans a user `@username`
}

function kick(bot, msg, suffix) {
  kicks a user `@username`
}

function mute(bot, msg, suffix) {
  mutes a user (text) (create new role without permissions to speak?) `@username` `time` (optional) (unmute after time elapsed)
}

function unmute(bot, msg, suffix) {
  unmutes a user (text) `@username`
}

function deafen(bot, msg, suffix) {
  deafens a user (voice) `@username` `time` (optional) (undeafens after time elapsed)
}

function undeafen(bot, msg, suffix) {
  undeafens a user (voice) `@username`
}

function addrole(bot, msg, suffix) {
  adds a role to a user `@username` `role`
}

function removerole(bot, msg, suffix) {
  removes a role from a user `@username` `role`
}

function purge(bot, msg, suffix) {
 clears chat messages `count` (default 10?) `@username` (optional)
}

function createchannel(bot, msg, suffix) {
  creates a channel `name` `type` (text or voice) (default text)
}

function deletechannel(bot, msg, suffix) {
  deletes a channel `name`
}

function deletechannel(bot, msg, suffix) {
  moves a user to another voice channel `@usernam` `voice channel name`
}

function createinvite(bot, msg, suffix) {
  creates an invitation `channel name` `duration (seconds)` `uses` `temporary true/false` `human readable true/false`
}

function updatechannel(bot, msg, suffix) {
  updates a channel `channel name` `new channel name` `new channel topic`
}

function createrole(bot, msg, suffix) {
  creates a role `name` `colour` `separated true/false` `permissions` (everything optional) (write !permissions for a list of available permissions)
}

function updaterole(bot, msg, suffix) {
  updates a role `name` `colour` `separated true/false` `permissions` (everything optional) (write !permissions for a list of available permissions)
}

function removerole(bot, msg, suffix) {
  deletes a role `name`
}

function changepermissions(bot, msg, suffix) {
  changes a users permissions `@username` `permission name: true/false` (write !permissions for a list of available permissions)
}

function permissions(bot, msg) {
  lists available permissions for !createrole
}

export default {
  bans,
  ban,
  kick,
  mute,
  deafen,
  addrole/roleadd/add-role/role-add,
  removerole/roleremove/remove-role/role-remove,
  purge/clear/clean,
  createchannel/channelcreate/create-channel/channel-create,
  deletechannel/channeldelete/delete-channel/channel-delete,
  move,
  createinvite/invitecreate/create-invite/invite-create,
  updatechannel/channelupdate/update-channel/channel-update,
  createrole/rolecreate/create-role/role-create,
  deleterole/roledelete/delete-role/role-delete,
  updaterole/roleupdate/update-role/role-update,
  changepermissions/changeperms/change-permissions/change-perms,
  permissions/perms,
};
