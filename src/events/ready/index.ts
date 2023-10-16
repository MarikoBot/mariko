import SuperClient from '../../root/SuperClient';
import { log } from '../../root/Util';
import postExec from '../../post.exec';

/**
 * The function for the ready event.
 *
 * @param client The client instance.
 * @returns Nothing.
 */
export default async function ready(client: SuperClient): Promise<void> {
  log(`Logged in as ${client.user.tag}.`);

  await (
    await client.Services.AdminPanel(client, '1113177643710423060', '1139950254322626751')
  ).monitoring.refreshChannel();
  await client.supportGuild.refreshSupport();
  client.blacklist = (await client.Servers.Core.getCore()).blacklist;

  void postExec(client);
}
