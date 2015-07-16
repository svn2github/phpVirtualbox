$vbox_version = '5.0'
$vbox_is_beta = "true"
$debian_version = 'wheezy'
$debian_arch = 'amd64'

package {'vim': ensure => 'installed' }
package {'exuberant-ctags': ensure => 'installed' }
package {'subversion': ensure => 'installed'}
package {'php5-cli': ensure => 'installed'}
package {'zip': ensure => 'installed'}
package {'libapache2-mod-php5': ensure => 'installed'}

class virtualbox_package {

    # Base package from vbox repo or beta
    if str2bool("$vbox_is_beta") {
    
        # Beta package from url
        package {'wget': ensure=> 'installed' }
        
        package {"virtualbox-$vbox_version":
            ensure => 'installed',
            require => Exec['install-vbox'],
        }
        
        exec {'install-vbox': 
            command => "/src/tools/install_latest_beta.sh $debian_version $debian_arch",
            user => 'root',
            require => Package['wget']
        }
    
    } else {
    
        package {"virtualbox-$vbox_version":
            ensure => 'installed',
            require => Apt::Source['vbox']
        }

    }    

}

class{'virtualbox_package': }

class {'apache':
    mpm_module => 'prefork',
}
apache::vhost { 'phpvirtualbox':
  default_vhost   => true,
  port            => 80,
  docroot         => "/src",
  options         => ['ExecCGI'],
}
class {'::apache::mod::php':
    content => '
    AddHandler php5-script .php
    AddType text/html .php',
}

file {'/etc/default/virtualbox':
    path    => '/etc/default/virtualbox',
    content => "VBOXWEB_HOST=127.0.0.1\nVBOXWEB_USER=vagrant\n",
    ensure  => file
}

include apt
apt::key {'vbox':
    id      => '7B0FAB3A13B907435925D9C954422A4B98AB5139',
    source  => 'https://www.virtualbox.org/download/oracle_vbox.asc',
}

apt::source {'vbox':
    comment           => 'VirtualBox debs',
    location          => 'http://download.virtualbox.org/virtualbox/debian',
    release           => 'wheezy',
    repos             => 'contrib',
    include  => {
        'src' => false,
        'deb' => true,
    },
    require           => Apt::Key['vbox'],
    before            => File['/etc/default/virtualbox'],
}


exec {'vboxweb_noauth':
    command     => 'VBoxManage setproperty websrvauthlibrary null',
    path        => '/usr/bin',
    refreshonly => true,
    user        => 'vagrant',
    subscribe   => Class['virtualbox_package'],
}
service {'vboxweb-service':
    ensure => running,
    enable => true,
    hasstatus => true,
    subscribe => File['/etc/default/virtualbox'],
    require   => Class['virtualbox_package'],
}


file {'phpvbox_config_php':
    replace => false,
    path    => '/src/config.php',
    source => "/src/vagrant/config.php",
    ensure  => present,
}

exec{'apt-get-update':
    command => 'apt-get update',
    path        => '/usr/bin',
}
Exec["apt-get-update"] -> Package <| |>


